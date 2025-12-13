module.exports = [
"[project]/components/Auth/RequireAuth.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RequireAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$spinner$2f$dist$2f$chunk$2d$TDOFO53L$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/spinner/dist/chunk-TDOFO53L.mjs [app-ssr] (ecmascript) <export spinner_default as Spinner>");
"use client";
;
;
;
;
function RequireAuth({ children, allowedRoles }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [authorized, setAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
            router.push("/login");
            return;
        }
        if (allowedRoles && allowedRoles.length > 0) {
            try {
                const user = JSON.parse(userStr);
                if (!allowedRoles.includes(user.role)) {
                    // User is logged in but doesn't have permission
                    alert("Access Denied: You do not have permission to view this page.");
                    router.push("/dashboard"); // Redirect to a safe page
                    return;
                }
            } catch (e) {
                console.error("Error parsing user data", e);
                router.push("/login");
                return;
            }
        }
        setAuthorized(true);
        setLoading(false);
    }, [
        router,
        allowedRoles
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex justify-center items-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$spinner$2f$dist$2f$chunk$2d$TDOFO53L$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__spinner_default__as__Spinner$3e$__["Spinner"], {
                size: "lg",
                label: "Verifying access..."
            }, void 0, false, {
                fileName: "[project]/components/Auth/RequireAuth.tsx",
                lineNumber: 49,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/Auth/RequireAuth.tsx",
            lineNumber: 48,
            columnNumber: 13
        }, this);
    }
    if (!authorized) {
        return null; // Don't render anything while redirecting
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/lib/coursesData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Course Data - Learn & Grow EdTech Platform
 * Detailed bilingual course information
 */ __turbopack_context__.s([
    "courses",
    ()=>courses,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const courses = [
    {
        id: "robotics-arduino",
        slug: "robotics-with-arduino",
        category: "Robotics",
        duration: "8 weeks",
        ageRange: "10-16 years",
        level: "Beginner to Intermediate",
        icon: "🤖",
        color: "from-blue-500 to-cyan-500",
        en: {
            title: "Robotics with Arduino",
            tagline: "Build Real Robots & Learn Electronics",
            overview: "Master the fundamentals of robotics and electronics by building actual robots using Arduino. Students will learn circuit design, programming, and bring robots to life through hands-on projects.",
            fullDescription: "This comprehensive 8-week course transforms students into robot builders. Learn how to program Arduino boards, understand sensors, motors, and create interactive robotic projects. From blinking LEDs to autonomous robots, students will gain practical engineering skills.",
            whoIsThisFor: [
                "Students aged 10-16 interested in robotics",
                "Beginners with no prior coding experience",
                "Students who love building things",
                "Future engineers and makers"
            ],
            whatYouWillLearn: [
                "Arduino programming fundamentals (C/C++)",
                "Circuit design and electronics basics",
                "Sensor integration (ultrasonic, IR, temperature)",
                "Motor control and movement",
                "Build 5+ robotics projects",
                "Problem-solving through debugging",
                "Engineering design thinking"
            ],
            features: [
                "Live instructor-led sessions (2x per week)",
                "Arduino Uno kit delivered to your home",
                "Step-by-step project guides",
                "Weekly quizzes and assignments",
                "Final showcase project",
                "Digital certificate upon completion",
                "Lifetime access to course materials"
            ],
            careerBenefits: [
                "Foundation for robotics engineering careers",
                "Skills for IoT and embedded systems",
                "Problem-solving abilities valued in all STEM fields",
                "Portfolio projects for university applications",
                "Competitive edge in robotics competitions"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Introduction to Arduino & Electronics",
                    topics: [
                        "What is Arduino and how it works",
                        "Setting up Arduino IDE",
                        "First program: Blinking LED",
                        "Understanding circuits and components"
                    ]
                },
                {
                    week: 2,
                    title: "Digital Inputs & Outputs",
                    topics: [
                        "Using buttons and switches",
                        "Traffic light system project",
                        "Digital vs analog signals",
                        "Building a reaction game"
                    ]
                },
                {
                    week: 3,
                    title: "Sensors & Data",
                    topics: [
                        "Ultrasonic distance sensor",
                        "Temperature and humidity sensing",
                        "Reading sensor data",
                        "Smart alarm system project"
                    ]
                },
                {
                    week: 4,
                    title: "Motors & Movement",
                    topics: [
                        "DC motors and motor drivers",
                        "Servo motors for precision",
                        "Building a motorized vehicle",
                        "Programming movement patterns"
                    ]
                },
                {
                    week: 5,
                    title: "Line Following Robot",
                    topics: [
                        "IR sensors for line detection",
                        "PID control basics",
                        "Building the chassis",
                        "Programming line following logic"
                    ]
                },
                {
                    week: 6,
                    title: "Obstacle Avoidance",
                    topics: [
                        "Ultrasonic sensor integration",
                        "Autonomous navigation",
                        "Decision-making algorithms",
                        "Building an exploring robot"
                    ]
                },
                {
                    week: 7,
                    title: "Advanced Projects",
                    topics: [
                        "Bluetooth control via smartphone",
                        "LCD display integration",
                        "Multi-sensor systems",
                        "Custom robot design"
                    ]
                },
                {
                    week: 8,
                    title: "Final Project & Showcase",
                    topics: [
                        "Design your own robot",
                        "Integration of multiple components",
                        "Presentation skills",
                        "Project demonstration and certification"
                    ]
                }
            ]
        },
        bn: {
            title: "Arduino দিয়ে রোবটিক্স",
            tagline: "আসল রোবট তৈরি করুন ও ইলেকট্রনিক্স শিখুন",
            overview: "Arduino ব্যবহার করে আসল রোবট তৈরির মাধ্যমে রোবটিক্স এবং ইলেকট্রনিক্সের মূল বিষয়গুলো আয়ত্ত করুন। শিক্ষার্থীরা সার্কিট ডিজাইন, প্রোগ্রামিং শিখবে এবং হাতে-কলমে প্রজেক্টের মাধ্যমে রোবটকে জীবন্ত করে তুলবে।",
            fullDescription: "এই সম্পূর্ণ ৮ সপ্তাহের কোর্স শিক্ষার্থীদের রোবট নির্মাতায় রূপান্তরিত করে। Arduino বোর্ড প্রোগ্রাম করতে, সেন্সর, মোটর বুঝতে এবং ইন্টারেক্টিভ রোবটিক প্রজেক্ট তৈরি করতে শিখুন। LED জ্বালানো থেকে শুরু করে স্বয়ংক্রিয় রোবট পর্যন্ত, শিক্ষার্থীরা ব্যবহারিক ইঞ্জিনিয়ারিং দক্ষতা অর্জন করবে।",
            whoIsThisFor: [
                "রোবটিক্সে আগ্রহী ১০-১৬ বছর বয়সী শিক্ষার্থী",
                "কোডিং এর পূর্ব অভিজ্ঞতা ছাড়াই শুরু করতে পারবে",
                "যারা জিনিস বানাতে ভালোবাসে",
                "ভবিষ্যৎ ইঞ্জিনিয়ার এবং মেকার"
            ],
            whatYouWillLearn: [
                "Arduino প্রোগ্রামিং এর মূলনীতি (C/C++)",
                "সার্কিট ডিজাইন ও ইলেকট্রনিক্সের বেসিক",
                "সেন্সর ইন্টিগ্রেশন (আল্ট্রাসনিক, IR, তাপমাত্রা)",
                "মোটর নিয়ন্ত্রণ ও চলাচল",
                "৫+ রোবটিক্স প্রজেক্ট তৈরি করুন",
                "ডিবাগিং এর মাধ্যমে সমস্যা সমাধান",
                "ইঞ্জিনিয়ারিং ডিজাইন চিন্তাভাবনা"
            ],
            features: [
                "লাইভ ইন্সট্রাক্টর-নেতৃত্বাধীন সেশন (সপ্তাহে ২বার)",
                "Arduino Uno কিট বাসায় ডেলিভারি",
                "ধাপে ধাপে প্রজেক্ট গাইড",
                "সাপ্তাহিক কুইজ এবং অ্যাসাইনমেন্ট",
                "ফাইনাল শোকেস প্রজেক্ট",
                "সম্পন্নের পর ডিজিটাল সার্টিফিকেট",
                "কোর্স ম্যাটেরিয়ালে লাইফটাইম অ্যাক্সেস"
            ],
            careerBenefits: [
                "রোবটিক্স ইঞ্জিনিয়ারিং ক্যারিয়ারের ভিত্তি",
                "IoT এবং এম্বেডেড সিস্টেমের দক্ষতা",
                "সব STEM ক্ষেত্রে মূল্যবান সমস্যা সমাধান ক্ষমতা",
                "বিশ্ববিদ্যালয় আবেদনের জন্য পোর্টফোলিও প্রজেক্ট",
                "রোবটিক্স প্রতিযোগিতায় প্রতিযোগিতামূলক সুবিধা"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Arduino ও ইলেকট্রনিক্সের পরিচিতি",
                    topics: [
                        "Arduino কী এবং এটি কীভাবে কাজ করে",
                        "Arduino IDE সেটআপ করা",
                        "প্রথম প্রোগ্রাম: LED জ্বালানো",
                        "সার্কিট ও কম্পোনেন্ট বোঝা"
                    ]
                },
                {
                    week: 2,
                    title: "ডিজিটাল ইনপুট ও আউটপুট",
                    topics: [
                        "বাটন এবং সুইচ ব্যবহার",
                        "ট্রাফিক লাইট সিস্টেম প্রজেক্ট",
                        "ডিজিটাল বনাম অ্যানালগ সিগন্যাল",
                        "রিঅ্যাকশন গেম তৈরি করা"
                    ]
                },
                {
                    week: 3,
                    title: "সেন্সর ও ডেটা",
                    topics: [
                        "আল্ট্রাসনিক দূরত্ব সেন্সর",
                        "তাপমাত্রা ও আর্দ্রতা সেন্সিং",
                        "সেন্সর ডেটা পড়া",
                        "স্মার্ট অ্যালার্ম সিস্টেম প্রজেক্ট"
                    ]
                },
                {
                    week: 4,
                    title: "মোটর ও গতি",
                    topics: [
                        "DC মোটর এবং মোটর ড্রাইভার",
                        "নির্ভুলতার জন্য সার্ভো মোটর",
                        "মোটর চালিত গাড়ি তৈরি",
                        "চলাচলের প্যাটার্ন প্রোগ্রামিং"
                    ]
                },
                {
                    week: 5,
                    title: "লাইন ফলোয়িং রোবট",
                    topics: [
                        "লাইন শনাক্তকরণের জন্য IR সেন্সর",
                        "PID নিয়ন্ত্রণের বেসিক",
                        "চেসিস তৈরি করা",
                        "লাইন ফলোয়িং লজিক প্রোগ্রামিং"
                    ]
                },
                {
                    week: 6,
                    title: "বাধা এড়ানো",
                    topics: [
                        "আল্ট্রাসনিক সেন্সর ইন্টিগ্রেশন",
                        "স্বয়ংক্রিয় নেভিগেশন",
                        "সিদ্ধান্ত গ্রহণের অ্যালগরিদম",
                        "অন্বেষণকারী রোবট তৈরি"
                    ]
                },
                {
                    week: 7,
                    title: "উন্নত প্রজেক্ট",
                    topics: [
                        "স্মার্টফোনের মাধ্যমে ব্লুটুথ নিয়ন্ত্রণ",
                        "LCD ডিসপ্লে ইন্টিগ্রেশন",
                        "মাল্টি-সেন্সর সিস্টেম",
                        "কাস্টম রোবট ডিজাইন"
                    ]
                },
                {
                    week: 8,
                    title: "ফাইনাল প্রজেক্ট ও শোকেস",
                    topics: [
                        "নিজের রোবট ডিজাইন করুন",
                        "একাধিক কম্পোনেন্টের ইন্টিগ্রেশন",
                        "উপস্থাপনা দক্ষতা",
                        "প্রজেক্ট প্রদর্শন ও সার্টিফিকেশন"
                    ]
                }
            ]
        }
    },
    {
        id: "python-ai",
        slug: "coding-with-python-and-ai",
        category: "Programming",
        duration: "10 weeks",
        ageRange: "12-18 years",
        level: "Beginner to Advanced",
        icon: "🐍",
        color: "from-green-500 to-emerald-500",
        en: {
            title: "Coding with Python & AI",
            tagline: "Master Python & Build AI Applications",
            overview: "Learn Python programming from scratch and dive into Artificial Intelligence. Create chatbots, image recognizers, and intelligent applications using real AI tools and libraries.",
            fullDescription: "This 10-week intensive course takes students from Python basics to building real AI applications. Students will master programming fundamentals, data structures, and then explore machine learning concepts by creating practical AI projects.",
            whoIsThisFor: [
                "Students aged 12-18 interested in programming",
                "Complete beginners to coding",
                "Students curious about AI and machine learning",
                "Future software developers and data scientists"
            ],
            whatYouWillLearn: [
                "Python programming fundamentals",
                "Object-oriented programming concepts",
                "Working with data and files",
                "Introduction to AI and machine learning",
                "Using libraries like TensorFlow and scikit-learn",
                "Build chatbots and AI applications",
                "Real-world problem solving with code"
            ],
            features: [
                "Live coding sessions (2x per week)",
                "Interactive coding challenges",
                "10+ hands-on projects",
                "Weekly coding assignments",
                "AI toolkit and resources",
                "Industry-recognized certificate",
                "Portfolio of AI projects"
            ],
            careerBenefits: [
                "Foundation for software development careers",
                "Skills for AI/ML engineering roles",
                "Data science and analytics capabilities",
                "Competitive programming readiness",
                "University computer science preparation"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Python Basics",
                    topics: [
                        "Variables and data types",
                        "Input/output",
                        "Basic operations",
                        "Your first Python program"
                    ]
                },
                {
                    week: 2,
                    title: "Control Flow",
                    topics: [
                        "If-else statements",
                        "Loops (for, while)",
                        "Logical operators",
                        "Interactive programs"
                    ]
                },
                {
                    week: 3,
                    title: "Functions & Modules",
                    topics: [
                        "Defining functions",
                        "Parameters and return values",
                        "Importing modules",
                        "Code organization"
                    ]
                },
                {
                    week: 4,
                    title: "Data Structures",
                    topics: [
                        "Lists and tuples",
                        "Dictionaries and sets",
                        "String manipulation",
                        "Data processing"
                    ]
                },
                {
                    week: 5,
                    title: "Object-Oriented Programming",
                    topics: [
                        "Classes and objects",
                        "Inheritance",
                        "Encapsulation",
                        "Building reusable code"
                    ]
                },
                {
                    week: 6,
                    title: "Working with Files & APIs",
                    topics: [
                        "Reading/writing files",
                        "JSON data",
                        "API integration",
                        "Web scraping basics"
                    ]
                },
                {
                    week: 7,
                    title: "Introduction to AI",
                    topics: [
                        "What is AI and ML?",
                        "Types of learning",
                        "Data preparation",
                        "First AI model"
                    ]
                },
                {
                    week: 8,
                    title: "Machine Learning Basics",
                    topics: [
                        "Supervised learning",
                        "Classification problems",
                        "Using scikit-learn",
                        "Model training and testing"
                    ]
                },
                {
                    week: 9,
                    title: "AI Projects",
                    topics: [
                        "Building a chatbot",
                        "Image classification",
                        "Sentiment analysis",
                        "Recommendation systems"
                    ]
                },
                {
                    week: 10,
                    title: "Capstone Project",
                    topics: [
                        "Design your AI application",
                        "Implementation",
                        "Testing and refinement",
                        "Final presentation"
                    ]
                }
            ]
        },
        bn: {
            title: "Python ও AI দিয়ে কোডিং",
            tagline: "Python আয়ত্ত করুন ও AI অ্যাপ্লিকেশন তৈরি করুন",
            overview: "শূন্য থেকে Python প্রোগ্রামিং শিখুন এবং আর্টিফিশিয়াল ইন্টেলিজেন্সে ডুব দিন। আসল AI টুল ও লাইব্রেরি ব্যবহার করে চ্যাটবট, ইমেজ রিকগনাইজার এবং বুদ্ধিমান অ্যাপ্লিকেশন তৈরি করুন।",
            fullDescription: "এই ১০ সপ্তাহের ইনটেনসিভ কোর্স শিক্ষার্থীদের Python বেসিক থেকে শুরু করে আসল AI অ্যাপ্লিকেশন তৈরি পর্যন্ত নিয়ে যায়। শিক্ষার্থীরা প্রোগ্রামিং ফান্ডামেন্টাল, ডেটা স্ট্রাকচার আয়ত্ত করবে এবং তারপর ব্যবহারিক AI প্রজেক্ট তৈরির মাধ্যমে মেশিন লার্নিং ধারণা অন্বেষণ করবে।",
            whoIsThisFor: [
                "প্রোগ্রামিংয়ে আগ্রহী ১২-১৮ বছর বয়সী শিক্ষার্থী",
                "কোডিংয়ে সম্পূর্ণ নতুন",
                "AI এবং মেশিন লার্নিং সম্পর্কে কৌতূহলী শিক্ষার্থী",
                "ভবিষ্যৎ সফটওয়্যার ডেভেলপার এবং ডেটা সাইন্টিস্ট"
            ],
            whatYouWillLearn: [
                "Python প্রোগ্রামিং এর মূলনীতি",
                "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং কনসেপ্ট",
                "ডেটা ও ফাইলের সাথে কাজ করা",
                "AI এবং মেশিন লার্নিং এর পরিচিতি",
                "TensorFlow এবং scikit-learn লাইব্রেরি ব্যবহার",
                "চ্যাটবট এবং AI অ্যাপ্লিকেশন তৈরি",
                "কোড দিয়ে বাস্তব-বিশ্বের সমস্যা সমাধান"
            ],
            features: [
                "লাইভ কোডিং সেশন (সপ্তাহে ২বার)",
                "ইন্টারেক্টিভ কোডিং চ্যালেঞ্জ",
                "১০+ হাতে-কলমে প্রজেক্ট",
                "সাপ্তাহিক কোডিং অ্যাসাইনমেন্ট",
                "AI টুলকিট এবং রিসোর্স",
                "ইন্ডাস্ট্রি-স্বীকৃত সার্টিফিকেট",
                "AI প্রজেক্টের পোর্টফোলিও"
            ],
            careerBenefits: [
                "সফটওয়্যার ডেভেলপমেন্ট ক্যারিয়ারের ভিত্তি",
                "AI/ML ইঞ্জিনিয়ারিং রোলের দক্ষতা",
                "ডেটা সাইন্স ও অ্যানালিটিক্স সক্ষমতা",
                "প্রতিযোগিতামূলক প্রোগ্রামিং প্রস্তুতি",
                "বিশ্ববিদ্যালয়ে কম্পিউটার সাইন্সের প্রস্তুতি"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Python বেসিক",
                    topics: [
                        "ভেরিয়েবল এবং ডেটা টাইপ",
                        "ইনপুট/আউটপুট",
                        "বেসিক অপারেশন",
                        "আপনার প্রথম Python প্রোগ্রাম"
                    ]
                },
                {
                    week: 2,
                    title: "কন্ট্রোল ফ্লো",
                    topics: [
                        "If-else স্টেটমেন্ট",
                        "লুপ (for, while)",
                        "লজিক্যাল অপারেটর",
                        "ইন্টারেক্টিভ প্রোগ্রাম"
                    ]
                },
                {
                    week: 3,
                    title: "ফাংশন ও মডিউল",
                    topics: [
                        "ফাংশন ডিফাইন করা",
                        "প্যারামিটার ও রিটার্ন ভ্যালু",
                        "মডিউল ইম্পোর্ট করা",
                        "কোড সংগঠন"
                    ]
                },
                {
                    week: 4,
                    title: "ডেটা স্ট্রাকচার",
                    topics: [
                        "লিস্ট এবং টাপল",
                        "ডিকশনারি ও সেট",
                        "স্ট্রিং ম্যানিপুলেশন",
                        "ডেটা প্রসেসিং"
                    ]
                },
                {
                    week: 5,
                    title: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং",
                    topics: [
                        "ক্লাস এবং অবজেক্ট",
                        "ইনহেরিটেন্স",
                        "এনক্যাপসুলেশন",
                        "পুনরায় ব্যবহারযোগ্য কোড তৈরি"
                    ]
                },
                {
                    week: 6,
                    title: "ফাইল ও API এর সাথে কাজ",
                    topics: [
                        "ফাইল রিড/রাইট করা",
                        "JSON ডেটা",
                        "API ইন্টিগ্রেশন",
                        "ওয়েব স্ক্র্যাপিং বেসিক"
                    ]
                },
                {
                    week: 7,
                    title: "AI এর পরিচিতি",
                    topics: [
                        "AI এবং ML কী?",
                        "লার্নিং এর প্রকারভেদ",
                        "ডেটা প্রস্তুতি",
                        "প্রথম AI মডেল"
                    ]
                },
                {
                    week: 8,
                    title: "মেশিন লার্নিং বেসিক",
                    topics: [
                        "সুপারভাইজড লার্নিং",
                        "ক্ল্যাসিফিকেশন সমস্যা",
                        "scikit-learn ব্যবহার",
                        "মডেল ট্রেনিং ও টেস্টিং"
                    ]
                },
                {
                    week: 9,
                    title: "AI প্রজেক্ট",
                    topics: [
                        "চ্যাটবট তৈরি করা",
                        "ইমেজ ক্ল্যাসিফিকেশন",
                        "সেন্টিমেন্ট অ্যানালাইসিস",
                        "রিকমেন্ডেশন সিস্টেম"
                    ]
                },
                {
                    week: 10,
                    title: "ক্যাপস্টোন প্রজেক্ট",
                    topics: [
                        "আপনার AI অ্যাপ্লিকেশন ডিজাইন করুন",
                        "ইমপ্লিমেন্টেশন",
                        "টেস্টিং ও রিফাইনমেন্ট",
                        "ফাইনাল উপস্থাপনা"
                    ]
                }
            ]
        }
    },
    {
        id: "math-coders",
        slug: "math-for-coders",
        category: "Mathematics",
        duration: "6 weeks",
        ageRange: "10-15 years",
        level: "Beginner",
        icon: "🔢",
        color: "from-purple-500 to-pink-500",
        en: {
            title: "Math for Coders",
            tagline: "Make Math Fun Through Coding",
            overview: "Discover how math powers all technology. Learn mathematical concepts through interactive coding projects. From geometry to algorithms, make math exciting and practical.",
            fullDescription: "This unique 6-week course transforms math from abstract concepts into exciting coding projects. Students visualize mathematical principles, create geometric art, and understand how math drives games, animations, and technology.",
            whoIsThisFor: [
                "Students aged 10-15 who find traditional math boring",
                "Learners who want to see math in action",
                "Students preparing for coding competitions",
                "Visual learners who love interactive content"
            ],
            whatYouWillLearn: [
                "Mathematical thinking through code",
                "Geometry and trigonometry concepts",
                "Algorithms and logic",
                "Pattern recognition",
                "Create mathematical art and games",
                "Problem-solving strategies",
                "Practical math applications"
            ],
            features: [
                "Visual and interactive lessons",
                "Math through games and animations",
                "Weekly challenge problems",
                "Project-based learning",
                "Digital certificate",
                "Fun math games to take home"
            ],
            careerBenefits: [
                "Strong foundation for competitive programming",
                "Better understanding of algorithms",
                "Improved logical thinking",
                "Confidence in math-related subjects",
                "Preparation for higher math courses"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Numbers & Patterns",
                    topics: [
                        "Number systems",
                        "Sequences and patterns",
                        "Creating pattern art",
                        "Math puzzles"
                    ]
                },
                {
                    week: 2,
                    title: "Geometry Through Code",
                    topics: [
                        "Shapes and coordinates",
                        "Drawing with code",
                        "Turtle graphics",
                        "Geometric art"
                    ]
                },
                {
                    week: 3,
                    title: "Angles & Animation",
                    topics: [
                        "Understanding angles",
                        "Rotation and movement",
                        "Animated shapes",
                        "Simple physics"
                    ]
                },
                {
                    week: 4,
                    title: "Logic & Algorithms",
                    topics: [
                        "Boolean logic",
                        "Sorting algorithms",
                        "Search algorithms",
                        "Optimization"
                    ]
                },
                {
                    week: 5,
                    title: "Probability & Randomness",
                    topics: [
                        "Random numbers",
                        "Probability in games",
                        "Simulations",
                        "Dice and card games"
                    ]
                },
                {
                    week: 6,
                    title: "Math Game Project",
                    topics: [
                        "Design a math game",
                        "Combine all concepts",
                        "User interface",
                        "Share and present"
                    ]
                }
            ]
        },
        bn: {
            title: "কোডারদের জন্য গণিত",
            tagline: "কোডিংয়ের মাধ্যমে গণিত মজাদার করুন",
            overview: "আবিষ্কার করুন কীভাবে গণিত সব প্রযুক্তিকে চালিত করে। ইন্টারেক্টিভ কোডিং প্রজেক্টের মাধ্যমে গাণিতিক ধারণা শিখুন। জ্যামিতি থেকে অ্যালগরিদম পর্যন্ত, গণিতকে উত্তেজনাপূর্ণ এবং ব্যবহারিক করে তুলুন।",
            fullDescription: "এই অনন্য ৬ সপ্তাহের কোর্স গণিতকে বিমূর্ত ধারণা থেকে উত্তেজনাপূর্ণ কোডিং প্রজেক্টে রূপান্তরিত করে। শিক্ষার্থীরা গাণিতিক নীতিগুলো দৃশ্যমান করে, জ্যামিতিক শিল্প তৈরি করে এবং বুঝতে পারে কীভাবে গণিত গেম, অ্যানিমেশন এবং প্রযুক্তি চালিত করে।",
            whoIsThisFor: [
                "১০-১৫ বছর বয়সী শিক্ষার্থী যারা ঐতিহ্যগত গণিত বিরক্তিকর মনে করে",
                "যারা গণিতকে কর্মরত দেখতে চায়",
                "কোডিং প্রতিযোগিতার জন্য প্রস্তুতি নিচ্ছে",
                "ভিজুয়াল লার্নার যারা ইন্টারেক্টিভ কন্টেন্ট পছন্দ করে"
            ],
            whatYouWillLearn: [
                "কোডের মাধ্যমে গাণিতিক চিন্তাভাবনা",
                "জ্যামিতি ও ত্রিকোণমিতি ধারণা",
                "অ্যালগরিদম এবং লজিক",
                "প্যাটার্ন রিকগনিশন",
                "গাণিতিক শিল্প ও গেম তৈরি করুন",
                "সমস্যা সমাধানের কৌশল",
                "ব্যবহারিক গণিত প্রয়োগ"
            ],
            features: [
                "ভিজুয়াল এবং ইন্টারেক্টিভ পাঠ",
                "গেম ও অ্যানিমেশনের মাধ্যমে গণিত",
                "সাপ্তাহিক চ্যালেঞ্জ সমস্যা",
                "প্রজেক্ট-ভিত্তিক শিক্ষা",
                "ডিজিটাল সার্টিফিকেট",
                "বাসায় নিয়ে যাওয়ার জন্য মজার গণিত গেম"
            ],
            careerBenefits: [
                "প্রতিযোগিতামূলক প্রোগ্রামিংয়ের শক্তিশালী ভিত্তি",
                "অ্যালগরিদমের ভালো বোঝাপড়া",
                "উন্নত লজিক্যাল চিন্তাভাবনা",
                "গণিত-সম্পর্কিত বিষয়ে আত্মবিশ্বাস",
                "উচ্চতর গণিত কোর্সের প্রস্তুতি"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "সংখ্যা ও প্যাটার্ন",
                    topics: [
                        "সংখ্যা পদ্ধতি",
                        "ক্রম এবং প্যাটার্ন",
                        "প্যাটার্ন আর্ট তৈরি",
                        "গণিত পাজল"
                    ]
                },
                {
                    week: 2,
                    title: "কোডের মাধ্যমে জ্যামিতি",
                    topics: [
                        "আকার এবং স্থানাঙ্ক",
                        "কোড দিয়ে আঁকা",
                        "টার্টল গ্রাফিক্স",
                        "জ্যামিতিক শিল্প"
                    ]
                },
                {
                    week: 3,
                    title: "কোণ ও অ্যানিমেশন",
                    topics: [
                        "কোণ বোঝা",
                        "ঘূর্ণন ও চলাচল",
                        "অ্যানিমেটেড আকার",
                        "সহজ পদার্থবিদ্যা"
                    ]
                },
                {
                    week: 4,
                    title: "লজিক ও অ্যালগরিদম",
                    topics: [
                        "বুলিয়ান লজিক",
                        "সর্টিং অ্যালগরিদম",
                        "সার্চ অ্যালগরিদম",
                        "অপটিমাইজেশন"
                    ]
                },
                {
                    week: 5,
                    title: "সম্ভাবনা ও র্যান্ডমনেস",
                    topics: [
                        "র্যান্ডম নম্বর",
                        "গেমে সম্ভাবনা",
                        "সিমুলেশন",
                        "পাশা এবং তাস খেলা"
                    ]
                },
                {
                    week: 6,
                    title: "গণিত গেম প্রজেক্ট",
                    topics: [
                        "একটি গণিত গেম ডিজাইন করুন",
                        "সব ধারণা একত্রিত করুন",
                        "ইউজার ইন্টারফেস",
                        "শেয়ার এবং উপস্থাপন"
                    ]
                }
            ]
        }
    },
    {
        id: "science-lab",
        slug: "science-lab-at-home",
        category: "Science",
        duration: "4 weeks",
        ageRange: "8-14 years",
        level: "Beginner",
        icon: "🔬",
        color: "from-orange-500 to-red-500",
        en: {
            title: "Science Lab at Home",
            tagline: "Hands-On Science Experiments",
            overview: "Turn your home into a science lab! Conduct exciting experiments, learn scientific methods, and discover the science behind everyday phenomena. Perfect introduction to STEM for young minds.",
            fullDescription: "This 4-week intensive course brings science to life through hands-on experiments students can do at home. From basic chemistry to physics principles, students will explore, experiment, and develop scientific thinking.",
            whoIsThisFor: [
                "Curious students aged 8-14",
                "Young scientists who love experiments",
                "Students who learn best through doing",
                "Parents looking for engaging at-home activities"
            ],
            whatYouWillLearn: [
                "Scientific method and inquiry",
                "Basic chemistry and reactions",
                "Physics principles (motion, energy, light)",
                "Biology basics and life science",
                "Recording observations and data",
                "Critical thinking and analysis",
                "Safe experiment practices"
            ],
            features: [
                "Experiment kit delivered to home",
                "Live experiment sessions",
                "Step-by-step video guides",
                "Parent involvement activities",
                "Digital experiment journal",
                "Certificate of completion",
                "Safe, household materials"
            ],
            careerBenefits: [
                "Foundation for scientific careers",
                "Develops curiosity and wonder",
                "Better understanding of school science",
                "Improved observation skills",
                "Confidence in experimental work"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "Chemistry Magic",
                    topics: [
                        "Acids and bases",
                        "Chemical reactions",
                        "Making slime (polymers)",
                        "Color-changing experiments"
                    ]
                },
                {
                    week: 2,
                    title: "Physics Fun",
                    topics: [
                        "Forces and motion",
                        "Simple machines",
                        "Light and mirrors",
                        "Sound waves"
                    ]
                },
                {
                    week: 3,
                    title: "Biology Basics",
                    topics: [
                        "Plant growth",
                        "Microorganisms",
                        "Human body systems",
                        "Ecosystems"
                    ]
                },
                {
                    week: 4,
                    title: "Final Science Fair",
                    topics: [
                        "Design your experiment",
                        "Scientific presentation",
                        "Document findings",
                        "Share discoveries"
                    ]
                }
            ]
        },
        bn: {
            title: "বাড়িতে সাইন্স ল্যাব",
            tagline: "হাতে-কলমে বিজ্ঞান পরীক্ষা",
            overview: "আপনার বাড়িকে একটি সাইন্স ল্যাবে পরিণত করুন! উত্তেজনাপূর্ণ পরীক্ষা-নিরীক্ষা করুন, বৈজ্ঞানিক পদ্ধতি শিখুন এবং দৈনন্দিন ঘটনার পিছনের বিজ্ঞান আবিষ্কার করুন। তরুণ মনের জন্য STEM এর নিখুঁত পরিচিতি।",
            fullDescription: "এই ৪ সপ্তাহের ইনটেনসিভ কোর্স শিক্ষার্থীরা বাড়িতে করতে পারে এমন হাতে-কলমে পরীক্ষার মাধ্যমে বিজ্ঞানকে জীবন্ত করে তোলে। বেসিক রসায়ন থেকে পদার্থবিদ্যার নীতি পর্যন্ত, শিক্ষার্থীরা অন্বেষণ করবে, পরীক্ষা করবে এবং বৈজ্ঞানিক চিন্তাভাবনা বিকশিত করবে।",
            whoIsThisFor: [
                "কৌতূহলী ৮-১৪ বছর বয়সী শিক্ষার্থী",
                "তরুণ বিজ্ঞানী যারা পরীক্ষা-নিরীক্ষা পছন্দ করে",
                "যারা কাজ করে সবচেয়ে ভালো শেখে",
                "বাড়িতে আকর্ষণীয় কার্যক্রম খুঁজছেন এমন অভিভাবক"
            ],
            whatYouWillLearn: [
                "বৈজ্ঞানিক পদ্ধতি ও অনুসন্ধান",
                "বেসিক রসায়ন এবং বিক্রিয়া",
                "পদার্থবিদ্যার নীতি (গতি, শক্তি, আলো)",
                "জীববিদ্যা বেসিক এবং জীবন বিজ্ঞান",
                "পর্যবেক্ষণ এবং ডেটা রেকর্ড করা",
                "সমালোচনামূলক চিন্তাভাবনা ও বিশ্লেষণ",
                "নিরাপদ পরীক্ষা পদ্ধতি"
            ],
            features: [
                "পরীক্ষা কিট বাসায় ডেলিভারি",
                "লাইভ পরীক্ষা সেশন",
                "ধাপে ধাপে ভিডিও গাইড",
                "অভিভাবক সম্পৃক্ততা কার্যক্রম",
                "ডিজিটাল পরীক্ষা জার্নাল",
                "সম্পন্নের সার্টিফিকেট",
                "নিরাপদ, গৃহস্থালি উপকরণ"
            ],
            careerBenefits: [
                "বৈজ্ঞানিক ক্যারিয়ারের ভিত্তি",
                "কৌতূহল ও বিস্ময় বিকশিত করে",
                "স্কুলের বিজ্ঞানের ভালো বোঝাপড়া",
                "উন্নত পর্যবেক্ষণ দক্ষতা",
                "পরীক্ষামূলক কাজে আত্মবিশ্বাস"
            ],
            syllabus: [
                {
                    week: 1,
                    title: "রসায়ন ম্যাজিক",
                    topics: [
                        "অ্যাসিড এবং বেস",
                        "রাসায়নিক বিক্রিয়া",
                        "স্লাইম তৈরি (পলিমার)",
                        "রঙ পরিবর্তনের পরীক্ষা"
                    ]
                },
                {
                    week: 2,
                    title: "পদার্থবিদ্যা মজা",
                    topics: [
                        "বল এবং গতি",
                        "সরল যন্ত্র",
                        "আলো এবং আয়না",
                        "শব্দ তরঙ্গ"
                    ]
                },
                {
                    week: 3,
                    title: "জীববিদ্যা বেসিক",
                    topics: [
                        "উদ্ভিদ বৃদ্ধি",
                        "অণুজীব",
                        "মানব দেহের সিস্টেম",
                        "ইকোসিস্টেম"
                    ]
                },
                {
                    week: 4,
                    title: "ফাইনাল সাইন্স ফেয়ার",
                    topics: [
                        "আপনার পরীক্ষা ডিজাইন করুন",
                        "বৈজ্ঞানিক উপস্থাপনা",
                        "ফলাফল ডকুমেন্ট করুন",
                        "আবিষ্কার শেয়ার করুন"
                    ]
                }
            ]
        }
    }
];
const __TURBOPACK__default__export__ = courses;
}),
"[project]/app/admin/courses/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ManageCoursesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Auth$2f$RequireAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Auth/RequireAuth.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-46NETW2U.mjs [app-ssr] (ecmascript) <export card_default as Card>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-5ALFRFZW.mjs [app-ssr] (ecmascript) <export card_body_default as CardBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/card/dist/chunk-J333S7JQ.mjs [app-ssr] (ecmascript) <export card_header_default as CardHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/button/dist/chunk-G5TSEPD3.mjs [app-ssr] (ecmascript) <export button_default as Button>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$QT7XRETF$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_default__as__Table$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-QT7XRETF.mjs [app-ssr] (ecmascript) <export table_default as Table>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$YRZGWF2W$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_header_default__as__TableHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-YRZGWF2W.mjs [app-ssr] (ecmascript) <export table_header_default as TableHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-TSPNSPCL.mjs [app-ssr] (ecmascript) <export table_column_default as TableColumn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$FKPXBCGS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_body_default__as__TableBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-FKPXBCGS.mjs [app-ssr] (ecmascript) <export table_body_default as TableBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$CIL4Y7FA$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_row_default__as__TableRow$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-CIL4Y7FA.mjs [app-ssr] (ecmascript) <export table_row_default as TableRow>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/table/dist/chunk-F3UDT23P.mjs [app-ssr] (ecmascript) <export table_cell_default as TableCell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/chip/dist/chunk-4WFLSIHH.mjs [app-ssr] (ecmascript) <export chip_default as Chip>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/input/dist/chunk-JZOL6GD7.mjs [app-ssr] (ecmascript) <export input_default as Input>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$KMN6V4NS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/modal/dist/chunk-KMN6V4NS.mjs [app-ssr] (ecmascript) <export modal_default as Modal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$RE5G2YMK$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/modal/dist/chunk-RE5G2YMK.mjs [app-ssr] (ecmascript) <export modal_content_default as ModalContent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$3S23ARPO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/modal/dist/chunk-3S23ARPO.mjs [app-ssr] (ecmascript) <export modal_header_default as ModalHeader>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$EPDLEVDR$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/modal/dist/chunk-EPDLEVDR.mjs [app-ssr] (ecmascript) <export modal_body_default as ModalBody>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$QY5NICTW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/modal/dist/chunk-QY5NICTW.mjs [app-ssr] (ecmascript) <export modal_footer_default as ModalFooter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@nextui-org/use-disclosure/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$coursesData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/coursesData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function ManageCoursesPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [courseList, setCourseList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const { isOpen, onOpen, onClose } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDisclosure"])();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$use$2d$disclosure$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDisclosure"])();
    const [selectedCourse, setSelectedCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Load courses from data file
        setCourseList(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$coursesData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["courses"]);
    }, []);
    const filteredCourses = courseList.filter((course)=>course.en.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleDelete = (courseId)=>{
        if (confirm("Are you sure you want to delete this course?")) {
            setCourseList(courseList.filter((c)=>c.id !== courseId));
            alert("Course deleted successfully! (Mock mode)");
            onClose();
        }
    };
    const handleViewDetails = (course)=>{
        setSelectedCourse(course);
        onOpen();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Auth$2f$RequireAuth$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        allowedRoles: [
            "admin"
        ],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-6 py-8 max-w-7xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                    variant: "light",
                    onPress: ()=>router.push("/admin"),
                    className: "mb-6",
                    children: "← Back to Admin Dashboard"
                }, void 0, false, {
                    fileName: "[project]/app/admin/courses/page.tsx",
                    lineNumber: 62,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$J333S7JQ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_header_default__as__CardHeader$3e$__["CardHeader"], {
                            className: "flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-2xl font-bold",
                                            children: "Manage Courses"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 mt-1",
                                            children: "View, edit, and delete all courses"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 74,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 72,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "primary",
                                    size: "lg",
                                    onPress: ()=>router.push("/admin/courses/create"),
                                    children: "+ Create New Course"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/courses/page.tsx",
                            lineNumber: 71,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$input$2f$dist$2f$chunk$2d$JZOL6GD7$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__input_default__as__Input$3e$__["Input"], {
                                        placeholder: "Search courses by name or category...",
                                        value: searchTerm,
                                        onChange: (e)=>setSearchTerm(e.target.value),
                                        size: "lg",
                                        startContent: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "🔍"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 47
                                        }, void 0),
                                        variant: "bordered"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/courses/page.tsx",
                                        lineNumber: 89,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 88,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                            className: "bg-blue-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600",
                                                        children: "Total Courses"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-blue-600",
                                                        children: courseList.length
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 104,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                lineNumber: 102,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 101,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                            className: "bg-green-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600",
                                                        children: "Robotics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 109,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-green-600",
                                                        children: courseList.filter((c)=>c.category === "Robotics").length
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 110,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                lineNumber: 108,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                            className: "bg-purple-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600",
                                                        children: "Programming"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 117,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-purple-600",
                                                        children: courseList.filter((c)=>c.category === "Programming").length
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 118,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                lineNumber: 116,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 115,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                            className: "bg-orange-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                className: "p-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-gray-600",
                                                        children: "Mathematics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl font-bold text-orange-600",
                                                        children: courseList.filter((c)=>c.category === "Mathematics").length
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 126,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                lineNumber: 124,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 123,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 100,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$QT7XRETF$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_default__as__Table$3e$__["Table"], {
                                    "aria-label": "Courses table",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$YRZGWF2W$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_header_default__as__TableHeader$3e$__["TableHeader"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "COURSE"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "CATEGORY"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 137,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "DURATION"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 138,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "AGE RANGE"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 139,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "LEVEL"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 140,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$TSPNSPCL$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_column_default__as__TableColumn$3e$__["TableColumn"], {
                                                    children: "ACTIONS"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 141,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 135,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$FKPXBCGS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_body_default__as__TableBody$3e$__["TableBody"], {
                                            children: filteredCourses.map((course)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$CIL4Y7FA$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_row_default__as__TableRow$3e$__["TableRow"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-2xl",
                                                                        children: course.icon
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 148,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "font-semibold",
                                                                                children: course.en.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                                lineNumber: 150,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-gray-500",
                                                                                children: course.bn.title
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                                lineNumber: 151,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 149,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                lineNumber: 147,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                                                color: "primary",
                                                                variant: "flat",
                                                                children: course.category
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                lineNumber: 156,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 155,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: course.duration
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 160,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: course.ageRange
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 161,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$chip$2f$dist$2f$chunk$2d$4WFLSIHH$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__chip_default__as__Chip$3e$__["Chip"], {
                                                                color: course.level.includes("Beginner") ? "success" : course.level.includes("Advanced") ? "danger" : "warning",
                                                                variant: "flat",
                                                                size: "sm",
                                                                children: course.level
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                lineNumber: 163,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 162,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$table$2f$dist$2f$chunk$2d$F3UDT23P$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__table_cell_default__as__TableCell$3e$__["TableCell"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                                        size: "sm",
                                                                        color: "primary",
                                                                        variant: "flat",
                                                                        onPress: ()=>handleViewDetails(course),
                                                                        children: "View"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 179,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                                        size: "sm",
                                                                        color: "warning",
                                                                        variant: "flat",
                                                                        onPress: ()=>{
                                                                            setSelectedCourse(course);
                                                                            onEditOpen();
                                                                        },
                                                                        children: "Edit"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 187,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                                        size: "sm",
                                                                        color: "danger",
                                                                        variant: "flat",
                                                                        onPress: ()=>{
                                                                            setSelectedCourse(course);
                                                                            if (confirm(`Delete "${course.en.title}"? This action cannot be undone.`)) {
                                                                                handleDelete(course.id);
                                                                            }
                                                                        },
                                                                        children: "Delete"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 198,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                lineNumber: 178,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, course.id, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 37
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 134,
                                    columnNumber: 25
                                }, this),
                                filteredCourses.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center py-12",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500 text-lg",
                                            children: "No courses found"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 224,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 text-sm mt-2",
                                            children: "Try adjusting your search or create a new course"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 223,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/courses/page.tsx",
                            lineNumber: 86,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/courses/page.tsx",
                    lineNumber: 70,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$KMN6V4NS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__["Modal"], {
                    isOpen: isOpen,
                    onClose: onClose,
                    size: "4xl",
                    scrollBehavior: "inside",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$RE5G2YMK$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__["ModalContent"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$3S23ARPO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__["ModalHeader"], {
                                className: "flex flex-col gap-1",
                                children: selectedCourse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-3xl",
                                            children: selectedCourse.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 239,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold",
                                                    children: selectedCourse.en.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500",
                                                    children: selectedCourse.bn.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 240,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 238,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 236,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$EPDLEVDR$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__["ModalBody"], {
                                children: selectedCourse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-lg mb-2",
                                                    children: "Overview"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 255,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-700",
                                                    children: selectedCourse.en.overview
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 254,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Duration"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: selectedCourse.duration
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 262,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Age Range"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: selectedCourse.ageRange
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 266,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Category"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 269,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: selectedCourse.category
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 270,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-600",
                                                            children: "Level"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-semibold",
                                                            children: selectedCourse.level
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-lg mb-2",
                                                    children: "What You'll Learn"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside space-y-1",
                                                    children: selectedCourse.en.whatYouWillLearn.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "text-gray-700",
                                                            children: item
                                                        }, idx, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 282,
                                                            columnNumber: 49
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 278,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-lg mb-2",
                                                    children: [
                                                        "Syllabus (",
                                                        selectedCourse.en.syllabus.length,
                                                        " weeks)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: selectedCourse.en.syllabus.map((week)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                                            className: "bg-gray-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                                className: "p-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "font-semibold",
                                                                        children: [
                                                                            "Week ",
                                                                            week.week,
                                                                            ": ",
                                                                            week.title
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 297,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-600 mt-1",
                                                                        children: week.topics.join(" • ")
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                                        lineNumber: 300,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/courses/page.tsx",
                                                                lineNumber: 296,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, week.week, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 49
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 293,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 289,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 253,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 251,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$QY5NICTW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__["ModalFooter"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "primary",
                                    onPress: onClose,
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 312,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 311,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/courses/page.tsx",
                        lineNumber: 235,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/courses/page.tsx",
                    lineNumber: 234,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$KMN6V4NS$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_default__as__Modal$3e$__["Modal"], {
                    isOpen: isEditOpen,
                    onClose: onEditClose,
                    size: "3xl",
                    scrollBehavior: "inside",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$RE5G2YMK$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_content_default__as__ModalContent$3e$__["ModalContent"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$3S23ARPO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_header_default__as__ModalHeader$3e$__["ModalHeader"], {
                                className: "flex flex-col gap-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-3xl",
                                            children: selectedCourse?.icon
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 324,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-bold",
                                                    children: "How to Edit This Course"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 326,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-500 font-normal",
                                                    children: selectedCourse?.en.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 327,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 325,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 323,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 322,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$EPDLEVDR$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_body_default__as__ModalBody$3e$__["ModalBody"], {
                                children: selectedCourse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50 border-l-4 border-blue-500 p-4 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-blue-900 mb-2",
                                                    children: "📝 Manual Editing Required"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-blue-800",
                                                    children: [
                                                        "This site uses ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "static export"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 339,
                                                            columnNumber: 60
                                                        }, this),
                                                        " for hosting on Hostinger. To edit courses, you need to modify the source code directly."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 336,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-lg mb-2",
                                                    children: "📍 Steps to Edit:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                                    className: "list-decimal list-inside space-y-2 text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                "Open file: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                    className: "bg-gray-100 px-2 py-1 rounded",
                                                                    children: "lib/coursesData.ts"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                                    lineNumber: 347,
                                                                    columnNumber: 60
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                "Find course with ID: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                    className: "bg-gray-100 px-2 py-1 rounded",
                                                                    children: selectedCourse.id
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                                    lineNumber: 348,
                                                                    columnNumber: 70
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Edit the course object (see structure below)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Save the file"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                "Rebuild: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                    className: "bg-gray-100 px-2 py-1 rounded",
                                                                    children: "npm run build"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 58
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 344,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between items-center mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "font-bold text-lg",
                                                            children: "📋 Course Data Structure:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                                            size: "sm",
                                                            color: "primary",
                                                            variant: "flat",
                                                            onPress: ()=>{
                                                                const courseData = JSON.stringify({
                                                                    id: selectedCourse.id,
                                                                    category: selectedCourse.category,
                                                                    duration: selectedCourse.duration,
                                                                    ageRange: selectedCourse.ageRange,
                                                                    level: selectedCourse.level,
                                                                    icon: selectedCourse.icon,
                                                                    "en.title": selectedCourse.en.title,
                                                                    "bn.title": selectedCourse.bn.title
                                                                }, null, 2);
                                                                navigator.clipboard.writeText(courseData);
                                                                alert("Course ID copied to clipboard!");
                                                            },
                                                            children: "📋 Copy Course ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 358,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$46NETW2U$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_default__as__Card$3e$__["Card"], {
                                                    className: "bg-gray-900",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$card$2f$dist$2f$chunk$2d$5ALFRFZW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__card_body_default__as__CardBody$3e$__["CardBody"], {
                                                        className: "p-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                            className: "text-xs text-green-400 overflow-x-auto",
                                                            children: `{
  id: "${selectedCourse.id}",
  category: "${selectedCourse.category}",
  duration: "${selectedCourse.duration}",
  ageRange: "${selectedCourse.ageRange}",
  level: "${selectedCourse.level}",
  icon: "${selectedCourse.icon}",
  en: {
    title: "${selectedCourse.en.title}",
    tagline: "${selectedCourse.en.tagline}",
    overview: "...",
  },
  bn: {
    title: "${selectedCourse.bn.title}",
    tagline: "${selectedCourse.bn.tagline}",
    overview: "...",
  }
}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/courses/page.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 355,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-orange-50 border-l-4 border-orange-500 p-4 rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-orange-900 mb-2",
                                                    children: "💡 Want Dynamic Editing?"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 407,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-orange-800",
                                                    children: "To enable full admin panel with database-backed editing:"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "list-disc list-inside text-sm text-orange-800 mt-2 space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: [
                                                                "Remove ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                    className: "bg-orange-100 px-1 rounded",
                                                                    children: "output: 'export'"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                                    lineNumber: 412,
                                                                    columnNumber: 56
                                                                }, this),
                                                                " from next.config.js"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 412,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Add a database (MongoDB/PostgreSQL)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 413,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Create API routes for CRUD operations"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 414,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: "Deploy to Vercel/Railway instead of Hostinger"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 415,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-orange-700 mt-3",
                                                    children: [
                                                        "See ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                            children: "STATIC_EXPORT_LIMITATIONS.md"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/courses/page.tsx",
                                                            lineNumber: 418,
                                                            columnNumber: 49
                                                        }, this),
                                                        " for details."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/courses/page.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/courses/page.tsx",
                                            lineNumber: 406,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 335,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 333,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$modal$2f$dist$2f$chunk$2d$QY5NICTW$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__modal_footer_default__as__ModalFooter$3e$__["ModalFooter"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$nextui$2d$org$2f$button$2f$dist$2f$chunk$2d$G5TSEPD3$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__button_default__as__Button$3e$__["Button"], {
                                    color: "primary",
                                    onPress: onEditClose,
                                    children: "Got It"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/courses/page.tsx",
                                    lineNumber: 425,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/courses/page.tsx",
                                lineNumber: 424,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/courses/page.tsx",
                        lineNumber: 321,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/courses/page.tsx",
                    lineNumber: 320,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/courses/page.tsx",
            lineNumber: 61,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/courses/page.tsx",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=_f3b8cbff._.js.map