export interface NewsItem {
  id: string;
  source: string;
  sourceCategory: "tech" | "national" | "feature";
  sourceColor?: string;
  sourceBadgeBg?: string;
  sourceBadgeBorder?: string;
  sourceBadgeText?: string;
  dateEn: string;
  dateBn: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  link: string;
  readTimeEn: string;
  readTimeBn: string;
}

export interface PressReleaseItem {
  id: string;
  dateEn: string;
  dateBn: string;
  tagEn: string;
  tagBn: string;
  titleEn: string;
  titleBn: string;
  excerptEn: string;
  excerptBn: string;
  pdfUrl?: string;
}

export interface PressMetrics {
  mediaStoriesEn: string;
  mediaStoriesBn: string;
  batchSizeEn: string;
  batchSizeBn: string;
  practicalLabEn: string;
  practicalLabBn: string;
  nationwideReachEn: string;
  nationwideReachBn: string;
}

export interface PressData {
  hero: {
    tagEn: string;
    tagBn: string;
    titleEn: string;
    titleBn: string;
    subtitleEn: string;
    subtitleBn: string;
    metrics: PressMetrics;
  };
  newsCoverage: NewsItem[];
  pressReleases: PressReleaseItem[];
  mediaContact: {
    email: string;
    whatsapp: string;
    phone: string;
  };
}

export const defaultPressData: PressData = {
  hero: {
    tagEn: "Press & Media Center",
    tagBn: "প্রেস ও মিডিয়া হাব",
    titleEn: "Shaping the Next Wave of STEM Innovators",
    titleBn: "আমাদের উদ্ভাবনী যাত্রা ও গণমাধ্যম প্রকাশনা",
    subtitleEn: "Read the latest news coverage, official press releases, and download brand assets from Bangladesh’s leading hands-on STEM academy.",
    subtitleBn: "Learn & Grow-এর সর্বশেষ সাফল্য, জাতীয় ও আন্তর্জাতিক সংবাদে প্রকাশিত প্রতিবেদন এবং অফিসিয়াল মিডিয়া রিসোর্স সেন্টার।",
    metrics: {
      mediaStoriesEn: "25+",
      mediaStoriesBn: "২৫+",
      batchSizeEn: "Max 15 Students",
      batchSizeBn: "১৫ জন",
      practicalLabEn: "100% Live",
      practicalLabBn: "১০০%",
      nationwideReachEn: "64 Districts",
      nationwideReachBn: "৬৪ জেলা",
    },
  },
  newsCoverage: [
    {
      id: "news-1",
      source: "The Daily Star",
      sourceCategory: "national",
      sourceColor: "#1E3A8A",
      sourceBadgeBg: "bg-blue-50",
      sourceBadgeBorder: "border-blue-200",
      sourceBadgeText: "text-blue-800",
      dateEn: "October 10, 2026",
      dateBn: "১০ অক্টোবর, ২০২৬",
      titleEn: "Learn & Grow: Transforming Kids from Passive Consumers to Creative Tech Innovators",
      titleBn: "লার্ন অ্যান্ড গ্রো: শিশুদের প্রযুক্তি ব্যবহারকারী থেকে সৃজনশীল উদ্ভাবকে রূপান্তর",
      summaryEn: "How a Bangladeshi STEM platform is pioneering experiential robotics kits and interactive coding cohorts designed especially for school-going youth.",
      summaryBn: "কীভাবে একটি বাংলাদেশি স্টেম প্ল্যাটফর্ম শিশুদের উপযোগী ইন্টারঅ্যাক্টিভ রোবটিক্স কিট ও লাইভ কোডিং কারিকুলাম দিয়ে দেশব্যাপী প্রযুক্তি বিপ্লব ঘটাচ্ছে।",
      link: "https://www.thedailystar.net",
      readTimeEn: "4 min read",
      readTimeBn: "৪ মিনিট পাঠ",
    },
    {
      id: "news-2",
      source: "TechCrunch",
      sourceCategory: "tech",
      sourceColor: "#059669",
      sourceBadgeBg: "bg-emerald-50",
      sourceBadgeBorder: "border-emerald-200",
      sourceBadgeText: "text-emerald-800",
      dateEn: "November 15, 2026",
      dateBn: "১৫ নভেম্বর, ২০২৬",
      titleEn: "EdTech Startup Learn & Grow Expands Hands-on Robotics & AI Curriculum in South Asia",
      titleBn: "দক্ষিণ এশিয়ায় হ্যান্ডস-অন রোবটিক্স ও এআই কারিকুলাম বিস্তৃত করছে লার্ন অ্যান্ড গ্রো",
      summaryEn: "Learn & Grow announces major expansion of its 15-student micro-cohort model, providing live mentoring from university engineers.",
      summaryBn: "শীর্ষ প্রকৌশলীদের তত্ত্বাবধানে ১৫-শিক্ষার্থীর মাইক্রো-ব্যাচ লাইভ ক্লাসরুম সম্প্রসারণের নতুন মাইলফলক ঘোষণা করল লার্ন অ্যান্ড গ্রো।",
      link: "https://techcrunch.com",
      readTimeEn: "5 min read",
      readTimeBn: "৫ মিনিট পাঠ",
    },
    {
      id: "news-3",
      source: "প্রথম আলো (Prothom Alo)",
      sourceCategory: "national",
      sourceColor: "#DC2626",
      sourceBadgeBg: "bg-red-50",
      sourceBadgeBorder: "border-red-200",
      sourceBadgeText: "text-red-700",
      dateEn: "December 02, 2026",
      dateBn: "০২ ডিসেম্বর, ২০২৬",
      titleEn: "Empowering Rural Students with Live Robotics Labs: The Learn & Grow Story",
      titleBn: "ঘরে বসেই প্রত্যন্ত অঞ্চলের খুদে বিজ্ঞানীদের রোবট ও প্রোগ্রামিং শেখাচ্ছে Learn & Grow",
      summaryEn: "Doorstep delivery of physical robotics kits paired with live online mentors eliminates geographical barriers for promising young minds.",
      summaryBn: "সরাসরি বাসায় ফিজিক্যাল রোবটিক্স কিট পৌঁছানো এবং লাইভ ক্লাসরুমের মেলবন্ধনে দেশের সব প্রান্তের শিশুদের জন্য দূর হলো প্রযুক্তি শিক্ষার দূরত্ব।",
      link: "https://www.prothomalo.com",
      readTimeEn: "3 min read",
      readTimeBn: "৩ মিনিট পাঠ",
    },
    {
      id: "news-4",
      source: "Dhaka Tribune",
      sourceCategory: "national",
      sourceColor: "#D97706",
      sourceBadgeBg: "bg-amber-50",
      sourceBadgeBorder: "border-amber-200",
      sourceBadgeText: "text-amber-800",
      dateEn: "January 14, 2026",
      dateBn: "১৪ জানুয়ারি, ২০২৬",
      titleEn: "Why 15-Student Micro Batches Are the Secret to Real STEM Engagement",
      titleBn: "কেন ১৫-শিক্ষার্থীর মাইক্রো-ব্যাচই বাস্তব স্টেম শিক্ষার সেরা চাবিকাঠি",
      summaryEn: "Moving away from overcrowded webinars, Learn & Grow's capped micro-cohorts guarantee that no student is left behind.",
      summaryBn: "গৎবাঁধা শত শত শিক্ষার্থীর রেকর্ডেড ক্লাস নয়, মাত্র ১৫ জনের লাইভ ব্যাচ নিশ্চিত করে প্রতিটি শিশুর ব্যক্তিগত যত্ন ও প্রশ্নোত্তরের সুযোগ।",
      link: "https://www.dhakatribune.com",
      readTimeEn: "4 min read",
      readTimeBn: "৪ মিনিট পাঠ",
    },
    {
      id: "news-5",
      source: "Tech in Asia",
      sourceCategory: "tech",
      sourceColor: "#7C3AED",
      sourceBadgeBg: "bg-purple-50",
      sourceBadgeBorder: "border-purple-200",
      sourceBadgeText: "text-purple-800",
      dateEn: "February 08, 2026",
      dateBn: "০৮ ফেব্রুয়ারি, ২০২৬",
      titleEn: "Top 10 Emerging EdTech Innovators Preparing the Next Generation for the AI Era",
      titleBn: "এআই যুগের প্রস্তুতিতে দক্ষিণ এশিয়ার শীর্ষ উদীয়মান ১০ এডটেক উদ্ভাবকের তালিকায় স্থান",
      summaryEn: "Recognized for combining proprietary hardware kits with interactive Python & Machine Learning pathways for teenagers.",
      summaryBn: "টিনএজারদের জন্য নিজস্ব হার্ডওয়্যার কিট এবং পাইথন ও মেশিন লার্নিং ট্র্যাকের সমন্বয়ের জন্য আন্তর্জাতিক সম্মাননা।",
      link: "https://www.techinasia.com",
      readTimeEn: "6 min read",
      readTimeBn: "৬ মিনিট পাঠ",
    },
    {
      id: "news-6",
      source: "The Business Standard",
      sourceCategory: "feature",
      sourceColor: "#2563EB",
      sourceBadgeBg: "bg-sky-50",
      sourceBadgeBorder: "border-sky-200",
      sourceBadgeText: "text-sky-800",
      dateEn: "March 20, 2026",
      dateBn: "২০ মার্চ, ২০২৬",
      titleEn: "The Maker Mindset: How Practical Projects Build Critical Thinking in Children",
      titleBn: "মেকার মানসিকতা: প্র্যাকটিক্যাল প্রজেক্ট কীভাবে শিশুদের যৌক্তিক চিন্তাশক্তি বৃদ্ধি করে",
      summaryEn: "An analytical deep dive into student capstone projects, from obstacle-avoiding cars to automated smart home plant watering systems.",
      summaryBn: "বাধা-শনাক্তকারী রোবট কার থেকে স্বয়ংক্রিয় স্মার্ট ইরিগেশন প্রজেক্ট—কীভাবে লার্ন অ্যান্ড গ্রোর শিক্ষার্থীরা বাস্তব সমস্যার সমাধান করছে।",
      link: "https://www.tbsnews.net",
      readTimeEn: "4 min read",
      readTimeBn: "৪ মিনিট পাঠ",
    },
  ],
  pressReleases: [
    {
      id: "pr-1",
      dateEn: "November 01, 2026",
      dateBn: "০১ নভেম্বর, ২০২৬",
      tagEn: "Curriculum Launch",
      tagBn: "নতুন কারিকুলাম",
      titleEn: "Learn & Grow Rolls Out Next-Gen Junior Robotics 2.0 with Smart Micro-Sensors",
      titleBn: "স্মার্ট মাইক্রো-সেন্সর সম্বলিত নেক্সট-জেন জুনিয়র রোবটিক্স ২.০ কারিকুলাম উন্মোচন",
      excerptEn: "The upgraded curriculum introduces ultrasonic navigation, servo-driven robotic arms, and Bluetooth-controlled telemetry for young creators.",
      excerptBn: "নতুন এই আপগ্রেডে আল্ট্রাসনিক নেভিগেশন, সারভো-চালিত রোবটিক আর্ম এবং ব্লুটুথ টেলিমেট্রি প্রজেক্ট অন্তর্ভুক্ত করা হয়েছে।",
    },
    {
      id: "pr-2",
      dateEn: "October 18, 2026",
      dateBn: "১৮ অক্টোবর, ২০২৬",
      tagEn: "Platform Milestone",
      tagBn: "প্ল্যাটফর্ম মাইলফলক",
      titleEn: "Official Launch of Automated 15-Student Micro-Cohort Dynamic Engine",
      titleBn: "স্বয়ংক্রিয় ১৫-শিক্ষার্থী ডাইনামিক মাইক্রো-ব্যাচ ইঞ্জিনের অফিসিয়াল ঘোষণা",
      excerptEn: "Ensuring maximum 1:15 mentor-to-student ratio across all live classes with automatic cohort rollover and individual progress monitoring.",
      excerptBn: "লাইভ ক্লাসে সর্বোচ্চ ১:১৫ মেন্টর অনুপাত নিশ্চিত করতে স্বয়ংক্রিয় ব্যাচ ডিস্ট্রিবিউশন ও ট্র্যাকিং সিস্টেম চালু।",
    },
    {
      id: "pr-3",
      dateEn: "September 05, 2026",
      dateBn: "০৫ সেপ্টেম্বর, ২০২৬",
      tagEn: "Partnership",
      tagBn: "অংশীদারিত্ব",
      titleEn: "Learn & Grow Partners with 25+ Leading Schools to Power Modern STEM Clubs",
      titleBn: "২৫টিরও বেশি শীর্ষ স্কুলের সাথে যৌথভাবে আধুনিক স্টেম ও রোবটিক্স ক্লাব পরিচালনা",
      excerptEn: "Providing robotics kits, teacher training workshops, and inter-school hackathon platforms to foster STEM literacy at the grassroots.",
      excerptBn: "তৃণমূল পর্যায়ে স্টেম চেতনা ছড়িয়ে দিতে স্কুলগুলোতে হার্ডওয়্যার ল্যাব সেটআপ এবং মেন্টরশিপ সহায়তা প্রদান।",
    },
  ],
  mediaContact: {
    email: "press@learn-grow.com",
    whatsapp: "https://wa.me/8801810184511",
    phone: "+8801810184511",
  },
};
