/**
 * Platform Features, Pricing, Technology Stack, and Additional Content
 * Learn & Grow EdTech Platform
 */

// Platform Features
export const platformFeatures = {
  en: [
    {
      id: "auth",
      icon: "Lock",
      title: "Secure Authentication",
      description:
        "JWT-based authentication with mobile OTP verification. Your data is safe and encrypted.",
    },
    {
      id: "dashboards",
      icon: "BarChart3",
      title: "Role-Based Dashboards",
      description:
        "Dedicated dashboards for students, parents, instructors, and admins with tailored features.",
    },
    {
      id: "live-classes",
      icon: "Video",
      title: "Interactive Live Classes",
      description:
        "Real-time instructor-led sessions with video, chat, and screen sharing capabilities.",
    },
    {
      id: "recorded",
      icon: "PlayCircle",
      title: "Recorded Sessions",
      description:
        "Access class recordings anytime. Review difficult concepts at your own pace.",
    },
    {
      id: "quizzes",
      icon: "CheckCircle2",
      title: "Quizzes & Assessments",
      description:
        "Interactive quizzes, assignments, and automated grading to track learning progress.",
    },
    {
      id: "projects",
      icon: "Wrench",
      title: "Hands-On Projects",
      description:
        "Real robotics and coding projects with step-by-step guidance and mentor support.",
    },
    {
      id: "progress",
      icon: "TrendingUp",
      title: "Progress Tracking",
      description:
        "Real-time progress monitoring for students and parents with detailed analytics.",
    },
    {
      id: "certificates",
      icon: "Award",
      title: "Digital Certificates",
      description:
        "Industry-recognized certificates upon course completion with blockchain verification.",
    },
    {
      id: "payment",
      icon: "CreditCard",
      title: "Flexible Payments",
      description:
        "Pay via bKash, Nagad, or card. Installment options available for all courses.",
    },
  ],
  bn: [
    {
      id: "auth",
      icon: "Lock",
      title: "সুরক্ষিত প্রমাণীকরণ",
      description:
        "মোবাইল OTP যাচাইকরণ সহ JWT-ভিত্তিক প্রমাণীকরণ। আপনার ডেটা নিরাপদ এবং এনক্রিপ্টেড।",
    },
    {
      id: "dashboards",
      icon: "BarChart3",
      title: "ভূমিকা-ভিত্তিক ড্যাশবোর্ড",
      description:
        "শিক্ষার্থী, অভিভাবক, ইন্সট্রাক্টর এবং অ্যাডমিনদের জন্য উপযোগী ফিচার সহ ডেডিকেটেড ড্যাশবোর্ড।",
    },
    {
      id: "live-classes",
      icon: "Video",
      title: "ইন্টারেক্টিভ লাইভ ক্লাস",
      description:
        "ভিডিও, চ্যাট এবং স্ক্রিন শেয়ারিং সহ রিয়েল-টাইম ইন্সট্রাক্টর-নেতৃত্বাধীন সেশন।",
    },
    {
      id: "recorded",
      icon: "PlayCircle",
      title: "রেকর্ডেড সেশন",
      description:
        "যেকোনো সময় ক্লাস রেকর্ডিং দেখুন। আপনার নিজস্ব গতিতে কঠিন ধারণা পর্যালোচনা করুন।",
    },
    {
      id: "quizzes",
      icon: "CheckCircle2",
      title: "কুইজ ও মূল্যায়ন",
      description:
        "শেখার অগ্রগতি ট্র্যাক করতে ইন্টারেক্টিভ কুইজ, অ্যাসাইনমেন্ট এবং স্বয়ংক্রিয় গ্রেডিং।",
    },
    {
      id: "projects",
      icon: "Wrench",
      title: "হাতে-কলমে প্রজেক্ট",
      description:
        "ধাপে ধাপে গাইডেন্স এবং মেন্টর সাপোর্ট সহ আসল রোবটিক্স ও কোডিং প্রজেক্ট।",
    },
    {
      id: "progress",
      icon: "TrendingUp",
      title: "অগ্রগতি ট্র্যাকিং",
      description:
        "বিস্তারিত অ্যানালিটিক্স সহ শিক্ষার্থী ও অভিভাবকদের জন্য রিয়েল-টাইম অগ্রগতি পর্যবেক্ষণ।",
    },
    {
      id: "certificates",
      icon: "Award",
      title: "ডিজিটাল সার্টিফিকেট",
      description:
        "ব্লকচেইন যাচাইকরণ সহ কোর্স সম্পন্নের পরে ইন্ডাস্ট্রি-স্বীকৃত সার্টিফিকেট।",
    },
    {
      id: "payment",
      icon: "CreditCard",
      title: "নমনীয় পেমেন্ট",
      description:
        "বিকাশ, নগদ বা কার্ডে পেমেন্ট করুন। সব কোর্সের জন্য কিস্তির সুবিধা উপলব্ধ।",
    },
  ],
};

// Registration Flow
export const registrationFlow = {
  en: {
    title: "Simple 3-Step Registration",
    steps: [
      {
        step: 1,
        title: "Mobile Verification",
        description:
          "Enter your mobile number and verify with OTP code sent to your phone.",
        icon: "Smartphone",
      },
      {
        step: 2,
        title: "Fill Information",
        description:
          "Complete student or guardian information form with basic details.",
        icon: "FileText",
      },
      {
        step: 3,
        title: "Set Password",
        description:
          "Create a secure password and you're ready to start learning!",
        icon: "Lock",
      },
    ],
    securityTips: [
      "Use a strong password with letters, numbers, and symbols",
      "Never share your password with anyone",
      "Enable two-factor authentication for extra security",
    ],
  },
  bn: {
    title: "সহজ ৩-ধাপ নিবন্ধন",
    steps: [
      {
        step: 1,
        title: "মোবাইল যাচাইকরণ",
        description:
          "আপনার মোবাইল নম্বর লিখুন এবং ফোনে পাঠানো OTP কোড দিয়ে যাচাই করুন।",
        icon: "Smartphone",
      },
      {
        step: 2,
        title: "তথ্য পূরণ করুন",
        description:
          "মৌলিক বিবরণ সহ শিক্ষার্থী বা অভিভাবকের তথ্য ফর্ম পূরণ করুন।",
        icon: "FileText",
      },
      {
        step: 3,
        title: "পাসওয়ার্ড সেট করুন",
        description:
          "একটি সুরক্ষিত পাসওয়ার্ড তৈরি করুন এবং শেখা শুরু করার জন্য প্রস্তুত হন!",
        icon: "Lock",
      },
    ],
    securityTips: [
      "অক্ষর, সংখ্যা এবং চিহ্ন সহ একটি শক্তিশালী পাসওয়ার্ড ব্যবহার করুন",
      "কখনও কারো সাথে আপনার পাসওয়ার্ড শেয়ার করবেন না",
      "অতিরিক্ত নিরাপত্তার জন্য টু-ফ্যাক্টর অথেন্টিকেশন সক্রিয় করুন",
    ],
  },
};

// Pricing Plans
export const pricingPlans = {
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
          "3 months access",
        ],
        popular: false,
        cta: "Enroll in Course",
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
          "Save 40% vs single courses",
        ],
        popular: true,
        cta: "Subscribe Now",
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
          "Compatible with our courses",
        ],
        popular: false,
        cta: "Buy Kit",
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
          "Partnership certificate",
        ],
        popular: false,
        cta: "Contact Sales",
      },
    ],
    paymentMethods: {
      title: "We Accept",
      methods: [
        "bKash",
        "Nagad",
        "Rocket",
        "Credit/Debit Card",
        "Bank Transfer",
      ],
    },
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
       
        ],
        popular: false,
        cta: "কোর্সে ভর্তি হন",
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
          "একক কোর্স থেকে ৪০% সাশ্রয়",
        ],
        popular: true,
        cta: "এখনই সাবস্ক্রাইব করুন",
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
          "আমাদের কোর্সের সাথে সামঞ্জস্যপূর্ণ",
        ],
        popular: false,
        cta: "কিট কিনুন",
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
          "পার্টনারশিপ সার্টিফিকেট",
        ],
        popular: false,
        cta: "সেলসের সাথে যোগাযোগ করুন",
      },
    ],
    paymentMethods: {
      title: "আমরা গ্রহণ করি",
      methods: [
        "বিকাশ",
        "নগদ",
        "রকেট",
        "ক্রেডিট/ডেবিট কার্ড",
        "ব্যাংক ট্রান্সফার",
      ],
    },
  },
};

// Technology Stack
export const techStack = {
  en: {
    short:
      "Built with modern technologies: Next.js, TypeScript, MongoDB, and more for a fast, secure, and scalable learning platform.",
    detailed: {
      title: "Powering Your Learning Experience",
      description:
        "Learn & Grow is built on cutting-edge technology stack ensuring fast performance, security, and reliability.",
      categories: [
        {
          category: "Frontend",
          technologies: [
            {
              name: "Next.js 14",
              description:
                "React framework with App Router for blazing-fast performance",
            },
            {
              name: "TypeScript",
              description:
                "Type-safe code for fewer bugs and better development",
            },
            {
              name: "Tailwind CSS",
              description: "Modern, responsive design system",
            },
            {
              name: "NextUI",
              description: "Beautiful, accessible UI components",
            },
            {
              name: "Framer Motion",
              description: "Smooth animations and transitions",
            },
          ],
        },
        {
          category: "Backend",
          technologies: [
            {
              name: "Node.js & Express",
              description: "High-performance server infrastructure",
            },
            {
              name: "MongoDB",
              description: "Flexible, scalable database for learning data",
            },
            {
              name: "Mongoose",
              description: "Elegant data modeling and validation",
            },
            {
              name: "JWT Authentication",
              description: "Secure user authentication and authorization",
            },
          ],
        },
        {
          category: "State Management",
          technologies: [
            {
              name: "Redux Toolkit",
              description: "Predictable state management",
            },
            {
              name: "RTK Query",
              description: "Powerful data fetching and caching",
            },
            {
              name: "Redux Persist",
              description: "Seamless offline experience",
            },
          ],
        },
        {
          category: "Integration",
          technologies: [
            {
              name: "Zoom/Google Meet",
              description: "Live class video conferencing",
            },
            {
              name: "Nodemailer",
              description: "Email notifications and communication",
            },
            {
              name: "bKash/Nagad API",
              description: "Local payment gateway integration",
            },
            {
              name: "SMS Gateway",
              description: "OTP verification and notifications",
            },
          ],
        },
        {
          category: "Performance",
          technologies: [
            {
              name: "Next.js SSR/SSG",
              description: "Server-side rendering for SEO and speed",
            },
            {
              name: "Image Optimization",
              description: "Automatic image compression and lazy loading",
            },
            {
              name: "Code Splitting",
              description: "Faster page loads with optimized bundles",
            },
          ],
        },
      ],
    },
  },
  bn: {
    short:
      "আধুনিক প্রযুক্তি দিয়ে তৈরি: Next.js, TypeScript, MongoDB, এবং আরও অনেক কিছু দ্রুত, নিরাপদ এবং স্কেলেবল শেখার প্ল্যাটফর্মের জন্য।",
    detailed: {
      title: "আপনার শেখার অভিজ্ঞতা চালিত করছে",
      description:
        "Learn & Grow অত্যাধুনিক প্রযুক্তি স্ট্যাকে তৈরি যা দ্রুত পারফরম্যান্স, নিরাপত্তা এবং নির্ভরযোগ্যতা নিশ্চিত করে।",
      categories: [
        {
          category: "ফ্রন্টএন্ড",
          technologies: [
            {
              name: "Next.js 14",
              description:
                "অতি দ্রুত পারফরম্যান্সের জন্য App Router সহ React ফ্রেমওয়ার্ক",
            },
            {
              name: "TypeScript",
              description: "কম বাগ এবং ভালো ডেভেলপমেন্টের জন্য টাইপ-সেফ কোড",
            },
            {
              name: "Tailwind CSS",
              description: "আধুনিক, রেসপন্সিভ ডিজাইন সিস্টেম",
            },
            {
              name: "NextUI",
              description: "সুন্দর, অ্যাক্সেসিবল UI কম্পোনেন্ট",
            },
            {
              name: "Framer Motion",
              description: "মসৃণ অ্যানিমেশন এবং ট্রানজিশন",
            },
          ],
        },
        {
          category: "ব্যাকএন্ড",
          technologies: [
            {
              name: "Node.js ও Express",
              description: "উচ্চ-পারফরম্যান্স সার্ভার ইনফ্রাস্ট্রাকচার",
            },
            {
              name: "MongoDB",
              description: "শেখার ডেটার জন্য নমনীয়, স্কেলেবল ডেটাবেস",
            },
            {
              name: "Mongoose",
              description: "মার্জিত ডেটা মডেলিং এবং যাচাইকরণ",
            },
            {
              name: "JWT Authentication",
              description: "সুরক্ষিত ইউজার প্রমাণীকরণ এবং অনুমোদন",
            },
          ],
        },
        {
          category: "স্টেট ম্যানেজমেন্ট",
          technologies: [
            {
              name: "Redux Toolkit",
              description: "পূর্বাভাসযোগ্য স্টেট ম্যানেজমেন্ট",
            },
            {
              name: "RTK Query",
              description: "শক্তিশালী ডেটা ফেচিং এবং ক্যাশিং",
            },
            { name: "Redux Persist", description: "নির্বিঘ্ন অফলাইন অভিজ্ঞতা" },
          ],
        },
        {
          category: "ইন্টিগ্রেশন",
          technologies: [
            {
              name: "Zoom/Google Meet",
              description: "লাইভ ক্লাস ভিডিও কনফারেন্সিং",
            },
            { name: "Nodemailer", description: "ইমেইল বিজ্ঞপ্তি এবং যোগাযোগ" },
            {
              name: "বিকাশ/নগদ API",
              description: "স্থানীয় পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
            },
            { name: "SMS Gateway", description: "OTP যাচাইকরণ এবং বিজ্ঞপ্তি" },
          ],
        },
        {
          category: "পারফরম্যান্স",
          technologies: [
            {
              name: "Next.js SSR/SSG",
              description: "SEO এবং গতির জন্য সার্ভার-সাইড রেন্ডারিং",
            },
            {
              name: "ইমেজ অপ্টিমাইজেশন",
              description: "স্বয়ংক্রিয় ইমেজ কম্প্রেশন এবং ল্যাজি লোডিং",
            },
            {
              name: "কোড স্প্লিটিং",
              description: "অপ্টিমাইজড বান্ডেল সহ দ্রুত পেজ লোড",
            },
          ],
        },
      ],
    },
  },
};

// Competitor Comparison
export const competitorComparison = {
  en: {
    title: "Why Choose Learn & Grow?",
    subtitle: "See how we compare to other EdTech platforms in Bangladesh",
    competitors: [
      { name: "Learn & Grow", logo: "Rocket" },
      { name: "10 Minute School", logo: "Smartphone" },
      { name: "Shikho", logo: "BookOpen" },
      { name: "Others", logo: "Building2" },
    ],
    features: [
      {
        feature: "Hands-On Robotics",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "Physical Kits Included",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "Live Instructor Classes",
        learnGrow: true,
        competitor1: false,
        competitor2: true,
        competitor3: true,
      },
      {
        feature: "STEM-First Curriculum",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "1-on-1 Mentorship",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "Project-Based Learning",
        learnGrow: true,
        competitor1: false,
        competitor2: true,
        competitor3: false,
      },
      {
        feature: "School Partnerships",
        learnGrow: true,
        competitor1: true,
        competitor2: true,
        competitor3: false,
      },
      {
        feature: "Affordable Pricing",
        learnGrow: true,
        competitor1: true,
        competitor2: true,
        competitor3: true,
      },
    ],
  },
  bn: {
    title: "কেন Learn & Grow বেছে নেবেন?",
    subtitle:
      "দেখুন বাংলাদেশের অন্যান্য এডটেক প্ল্যাটফর্মের সাথে আমরা কীভাবে তুলনা করি",
    competitors: [
      { name: "Learn & Grow", logo: "Rocket" },
      { name: "10 Minute School", logo: "Smartphone" },
      { name: "Shikho", logo: "BookOpen" },
      { name: "অন্যান্য", logo: "Building2" },
    ],
    features: [
      {
        feature: "হাতে-কলমে রোবটিক্স",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "ফিজিক্যাল কিট অন্তর্ভুক্ত",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "লাইভ ইন্সট্রাক্টর ক্লাস",
        learnGrow: true,
        competitor1: false,
        competitor2: true,
        competitor3: true,
      },
      {
        feature: "STEM-ফার্স্ট পাঠ্যক্রম",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "১-অন-১ মেন্টরশিপ",
        learnGrow: true,
        competitor1: false,
        competitor2: false,
        competitor3: false,
      },
      {
        feature: "প্রজেক্ট-ভিত্তিক শিক্ষা",
        learnGrow: true,
        competitor1: false,
        competitor2: true,
        competitor3: false,
      },
      {
        feature: "স্কুল পার্টনারশিপ",
        learnGrow: true,
        competitor1: true,
        competitor2: true,
        competitor3: false,
      },
      {
        feature: "সাশ্রয়ী মূল্য",
        learnGrow: true,
        competitor1: true,
        competitor2: true,
        competitor3: true,
      },
    ],
  },
};

export default {
  platformFeatures,
  registrationFlow,
  pricingPlans,
  techStack,
  competitorComparison,
};
