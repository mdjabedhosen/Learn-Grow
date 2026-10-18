/**
 * Course Data - Learn & Grow EdTech Platform
 * Detailed bilingual course information
 */

export interface Course {
  id: string;
  slug: string;
  category: string;
  duration: string;
  ageRange: string;
  level: string;
  icon: string;
  color: string;
  en: {
    title: string;
    tagline: string;
    overview: string;
    fullDescription: string;
    whoIsThisFor: string[];
    whatYouWillLearn: string[];
    features: string[];
    careerBenefits: string[];
    syllabus: {
      week: number;
      title: string;
      topics: string[];
    }[];
  };
  bn: {
    title: string;
    tagline: string;
    overview: string;
    fullDescription: string;
    whoIsThisFor: string[];
    whatYouWillLearn: string[];
    features: string[];
    careerBenefits: string[];
    syllabus: {
      week: number;
      title: string;
      topics: string[];
    }[];
  };
}

export const courses: Course[] = [
  {
    id: "robotics-arduino",
    slug: "robotics-with-arduino",
    category: "Robotics",
    duration: "8 weeks",
    ageRange: "10-16 years",
    level: "Beginner to Intermediate",
    icon: "Bot",
    color: "from-blue-500 to-cyan-500",
    en: {
      title: "Robotics with Arduino",
      tagline: "Build Real Robots & Learn Electronics",
      overview:
        "Master the fundamentals of robotics and electronics by building actual robots using Arduino. Students will learn circuit design, programming, and bring robots to life through hands-on projects.",
      fullDescription:
        "This comprehensive 8-week course transforms students into robot builders. Learn how to program Arduino boards, understand sensors, motors, and create interactive robotic projects. From blinking LEDs to autonomous robots, students will gain practical engineering skills.",
      whoIsThisFor: [
        "Students aged 10-16 interested in robotics",
        "Beginners with no prior coding experience",
        "Students who love building things",
        "Future engineers and makers",
      ],
      whatYouWillLearn: [
        "Arduino programming fundamentals (C/C++)",
        "Circuit design and electronics basics",
        "Sensor integration (ultrasonic, IR, temperature)",
        "Motor control and movement",
        "Build 5+ robotics projects",
        "Problem-solving through debugging",
        "Engineering design thinking",
      ],
      features: [
        "Live instructor-led sessions (2x per week)",
        "Arduino Uno kit delivered to your home",
        "Step-by-step project guides",
        "Weekly quizzes and assignments",
        "Final showcase project",
        "Digital certificate upon completion",
        "Lifetime access to course materials",
      ],
      careerBenefits: [
        "Foundation for robotics engineering careers",
        "Skills for IoT and embedded systems",
        "Problem-solving abilities valued in all STEM fields",
        "Portfolio projects for university applications",
        "Competitive edge in robotics competitions",
      ],
      syllabus: [
        {
          week: 1,
          title: "Introduction to Arduino & Electronics",
          topics: [
            "What is Arduino and how it works",
            "Setting up Arduino IDE",
            "First program: Blinking LED",
            "Understanding circuits and components",
          ],
        },
        {
          week: 2,
          title: "Digital Inputs & Outputs",
          topics: [
            "Using buttons and switches",
            "Traffic light system project",
            "Digital vs analog signals",
            "Building a reaction game",
          ],
        },
        {
          week: 3,
          title: "Sensors & Data",
          topics: [
            "Ultrasonic distance sensor",
            "Temperature and humidity sensing",
            "Reading sensor data",
            "Smart alarm system project",
          ],
        },
        {
          week: 4,
          title: "Motors & Movement",
          topics: [
            "DC motors and motor drivers",
            "Servo motors for precision",
            "Building a motorized vehicle",
            "Programming movement patterns",
          ],
        },
        {
          week: 5,
          title: "Line Following Robot",
          topics: [
            "IR sensors for line detection",
            "PID control basics",
            "Building the chassis",
            "Programming line following logic",
          ],
        },
        {
          week: 6,
          title: "Obstacle Avoidance",
          topics: [
            "Ultrasonic sensor integration",
            "Autonomous navigation",
            "Decision-making algorithms",
            "Building an exploring robot",
          ],
        },
        {
          week: 7,
          title: "Advanced Projects",
          topics: [
            "Bluetooth control via smartphone",
            "LCD display integration",
            "Multi-sensor systems",
            "Custom robot design",
          ],
        },
        {
          week: 8,
          title: "Final Project & Showcase",
          topics: [
            "Design your own robot",
            "Integration of multiple components",
            "Presentation skills",
            "Project demonstration and certification",
          ],
        },
      ],
    },
    bn: {
      title: "Arduino দিয়ে রোবটিক্স",
      tagline: "আসল রোবট তৈরি করুন ও ইলেকট্রনিক্স শিখুন",
      overview:
        "Arduino ব্যবহার করে আসল রোবট তৈরির মাধ্যমে রোবটিক্স এবং ইলেকট্রনিক্সের মূল বিষয়গুলো আয়ত্ত করুন। শিক্ষার্থীরা সার্কিট ডিজাইন, প্রোগ্রামিং শিখবে এবং হাতে-কলমে প্রজেক্টের মাধ্যমে রোবটকে জীবন্ত করে তুলবে।",
      fullDescription:
        "এই সম্পূর্ণ ৮ সপ্তাহের কোর্স শিক্ষার্থীদের রোবট নির্মাতায় রূপান্তরিত করে। Arduino বোর্ড প্রোগ্রাম করতে, সেন্সর, মোটর বুঝতে এবং ইন্টারেক্টিভ রোবটিক প্রজেক্ট তৈরি করতে শিখুন। LED জ্বালানো থেকে শুরু করে স্বয়ংক্রিয় রোবট পর্যন্ত, শিক্ষার্থীরা ব্যবহারিক ইঞ্জিনিয়ারিং দক্ষতা অর্জন করবে।",
      whoIsThisFor: [
        "রোবটিক্সে আগ্রহী ১০-১৬ বছর বয়সী শিক্ষার্থী",
        "কোডিং এর পূর্ব অভিজ্ঞতা ছাড়াই শুরু করতে পারবে",
        "যারা জিনিস বানাতে ভালোবাসে",
        "ভবিষ্যৎ ইঞ্জিনিয়ার এবং মেকার",
      ],
      whatYouWillLearn: [
        "Arduino প্রোগ্রামিং এর মূলনীতি (C/C++)",
        "সার্কিট ডিজাইন ও ইলেকট্রনিক্সের বেসিক",
        "সেন্সর ইন্টিগ্রেশন (আল্ট্রাসনিক, IR, তাপমাত্রা)",
        "মোটর নিয়ন্ত্রণ ও চলাচল",
        "৫+ রোবটিক্স প্রজেক্ট তৈরি করুন",
        "ডিবাগিং এর মাধ্যমে সমস্যা সমাধান",
        "ইঞ্জিনিয়ারিং ডিজাইন চিন্তাভাবনা",
      ],
      features: [
        "লাইভ ইন্সট্রাক্টর-নেতৃত্বাধীন সেশন (সপ্তাহে ২বার)",
        "Arduino Uno কিট বাসায় ডেলিভারি",
        "ধাপে ধাপে প্রজেক্ট গাইড",
        "সাপ্তাহিক কুইজ এবং অ্যাসাইনমেন্ট",
        "ফাইনাল শোকেস প্রজেক্ট",
        "সম্পন্নের পর ডিজিটাল সার্টিফিকেট",
        "কোর্স ম্যাটেরিয়ালে লাইফটাইম অ্যাক্সেস",
      ],
      careerBenefits: [
        "রোবটিক্স ইঞ্জিনিয়ারিং ক্যারিয়ারের ভিত্তি",
        "IoT এবং এম্বেডেড সিস্টেমের দক্ষতা",
        "সব STEM ক্ষেত্রে মূল্যবান সমস্যা সমাধান ক্ষমতা",
        "বিশ্ববিদ্যালয় আবেদনের জন্য পোর্টফোলিও প্রজেক্ট",
        "রোবটিক্স প্রতিযোগিতায় প্রতিযোগিতামূলক সুবিধা",
      ],
      syllabus: [
        {
          week: 1,
          title: "Arduino ও ইলেকট্রনিক্সের পরিচিতি",
          topics: [
            "Arduino কী এবং এটি কীভাবে কাজ করে",
            "Arduino IDE সেটআপ করা",
            "প্রথম প্রোগ্রাম: LED জ্বালানো",
            "সার্কিট ও কম্পোনেন্ট বোঝা",
          ],
        },
        {
          week: 2,
          title: "ডিজিটাল ইনপুট ও আউটপুট",
          topics: [
            "বাটন এবং সুইচ ব্যবহার",
            "ট্রাফিক লাইট সিস্টেম প্রজেক্ট",
            "ডিজিটাল বনাম অ্যানালগ সিগন্যাল",
            "রিঅ্যাকশন গেম তৈরি করা",
          ],
        },
        {
          week: 3,
          title: "সেন্সর ও ডেটা",
          topics: [
            "আল্ট্রাসনিক দূরত্ব সেন্সর",
            "তাপমাত্রা ও আর্দ্রতা সেন্সিং",
            "সেন্সর ডেটা পড়া",
            "স্মার্ট অ্যালার্ম সিস্টেম প্রজেক্ট",
          ],
        },
        {
          week: 4,
          title: "মোটর ও গতি",
          topics: [
            "DC মোটর এবং মোটর ড্রাইভার",
            "নির্ভুলতার জন্য সার্ভো মোটর",
            "মোটর চালিত গাড়ি তৈরি",
            "চলাচলের প্যাটার্ন প্রোগ্রামিং",
          ],
        },
        {
          week: 5,
          title: "লাইন ফলোয়িং রোবট",
          topics: [
            "লাইন শনাক্তকরণের জন্য IR সেন্সর",
            "PID নিয়ন্ত্রণের বেসিক",
            "চেসিস তৈরি করা",
            "লাইন ফলোয়িং লজিক প্রোগ্রামিং",
          ],
        },
        {
          week: 6,
          title: "বাধা এড়ানো",
          topics: [
            "আল্ট্রাসনিক সেন্সর ইন্টিগ্রেশন",
            "স্বয়ংক্রিয় নেভিগেশন",
            "সিদ্ধান্ত গ্রহণের অ্যালগরিদম",
            "অন্বেষণকারী রোবট তৈরি",
          ],
        },
        {
          week: 7,
          title: "উন্নত প্রজেক্ট",
          topics: [
            "স্মার্টফোনের মাধ্যমে ব্লুটুথ নিয়ন্ত্রণ",
            "LCD ডিসপ্লে ইন্টিগ্রেশন",
            "মাল্টি-সেন্সর সিস্টেম",
            "কাস্টম রোবট ডিজাইন",
          ],
        },
        {
          week: 8,
          title: "ফাইনাল প্রজেক্ট ও শোকেস",
          topics: [
            "নিজের রোবট ডিজাইন করুন",
            "একাধিক কম্পোনেন্টের ইন্টিগ্রেশন",
            "উপস্থাপনা দক্ষতা",
            "প্রজেক্ট প্রদর্শন ও সার্টিফিকেশন",
          ],
        },
      ],
    },
  },
  {
    id: "python-ai",
    slug: "coding-with-python-and-ai",
    category: "Programming",
    duration: "10 weeks",
    ageRange: "12-18 years",
    level: "Beginner to Advanced",
    icon: "Code",
    color: "from-green-500 to-emerald-500",
    en: {
      title: "Coding with Python & AI",
      tagline: "Master Python & Build AI Applications",
      overview:
        "Learn Python programming from scratch and dive into Artificial Intelligence. Create chatbots, image recognizers, and intelligent applications using real AI tools and libraries.",
      fullDescription:
        "This 10-week intensive course takes students from Python basics to building real AI applications. Students will master programming fundamentals, data structures, and then explore machine learning concepts by creating practical AI projects.",
      whoIsThisFor: [
        "Students aged 12-18 interested in programming",
        "Complete beginners to coding",
        "Students curious about AI and machine learning",
        "Future software developers and data scientists",
      ],
      whatYouWillLearn: [
        "Python programming fundamentals",
        "Object-oriented programming concepts",
        "Working with data and files",
        "Introduction to AI and machine learning",
        "Using libraries like TensorFlow and scikit-learn",
        "Build chatbots and AI applications",
        "Real-world problem solving with code",
      ],
      features: [
        "Live coding sessions (2x per week)",
        "Interactive coding challenges",
        "10+ hands-on projects",
        "Weekly coding assignments",
        "AI toolkit and resources",
        "Industry-recognized certificate",
        "Portfolio of AI projects",
      ],
      careerBenefits: [
        "Foundation for software development careers",
        "Skills for AI/ML engineering roles",
        "Data science and analytics capabilities",
        "Competitive programming readiness",
        "University computer science preparation",
      ],
      syllabus: [
        {
          week: 1,
          title: "Python Basics",
          topics: [
            "Variables and data types",
            "Input/output",
            "Basic operations",
            "Your first Python program",
          ],
        },
        {
          week: 2,
          title: "Control Flow",
          topics: [
            "If-else statements",
            "Loops (for, while)",
            "Logical operators",
            "Interactive programs",
          ],
        },
        {
          week: 3,
          title: "Functions & Modules",
          topics: [
            "Defining functions",
            "Parameters and return values",
            "Importing modules",
            "Code organization",
          ],
        },
        {
          week: 4,
          title: "Data Structures",
          topics: [
            "Lists and tuples",
            "Dictionaries and sets",
            "String manipulation",
            "Data processing",
          ],
        },
        {
          week: 5,
          title: "Object-Oriented Programming",
          topics: [
            "Classes and objects",
            "Inheritance",
            "Encapsulation",
            "Building reusable code",
          ],
        },
        {
          week: 6,
          title: "Working with Files & APIs",
          topics: [
            "Reading/writing files",
            "JSON data",
            "API integration",
            "Web scraping basics",
          ],
        },
        {
          week: 7,
          title: "Introduction to AI",
          topics: [
            "What is AI and ML?",
            "Types of learning",
            "Data preparation",
            "First AI model",
          ],
        },
        {
          week: 8,
          title: "Machine Learning Basics",
          topics: [
            "Supervised learning",
            "Classification problems",
            "Using scikit-learn",
            "Model training and testing",
          ],
        },
        {
          week: 9,
          title: "AI Projects",
          topics: [
            "Building a chatbot",
            "Image classification",
            "Sentiment analysis",
            "Recommendation systems",
          ],
        },
        {
          week: 10,
          title: "Capstone Project",
          topics: [
            "Design your AI application",
            "Implementation",
            "Testing and refinement",
            "Final presentation",
          ],
        },
      ],
    },
    bn: {
      title: "Python ও AI দিয়ে কোডিং",
      tagline: "Python আয়ত্ত করুন ও AI অ্যাপ্লিকেশন তৈরি করুন",
      overview:
        "শূন্য থেকে Python প্রোগ্রামিং শিখুন এবং আর্টিফিশিয়াল ইন্টেলিজেন্সে ডুব দিন। আসল AI টুল ও লাইব্রেরি ব্যবহার করে চ্যাটবট, ইমেজ রিকগনাইজার এবং বুদ্ধিমান অ্যাপ্লিকেশন তৈরি করুন।",
      fullDescription:
        "এই ১০ সপ্তাহের ইনটেনসিভ কোর্স শিক্ষার্থীদের Python বেসিক থেকে শুরু করে আসল AI অ্যাপ্লিকেশন তৈরি পর্যন্ত নিয়ে যায়। শিক্ষার্থীরা প্রোগ্রামিং ফান্ডামেন্টাল, ডেটা স্ট্রাকচার আয়ত্ত করবে এবং তারপর ব্যবহারিক AI প্রজেক্ট তৈরির মাধ্যমে মেশিন লার্নিং ধারণা অন্বেষণ করবে।",
      whoIsThisFor: [
        "প্রোগ্রামিংয়ে আগ্রহী ১২-১৮ বছর বয়সী শিক্ষার্থী",
        "কোডিংয়ে সম্পূর্ণ নতুন",
        "AI এবং মেশিন লার্নিং সম্পর্কে কৌতূহলী শিক্ষার্থী",
        "ভবিষ্যৎ সফটওয়্যার ডেভেলপার এবং ডেটা সাইন্টিস্ট",
      ],
      whatYouWillLearn: [
        "Python প্রোগ্রামিং এর মূলনীতি",
        "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং কনসেপ্ট",
        "ডেটা ও ফাইলের সাথে কাজ করা",
        "AI এবং মেশিন লার্নিং এর পরিচিতি",
        "TensorFlow এবং scikit-learn লাইব্রেরি ব্যবহার",
        "চ্যাটবট এবং AI অ্যাপ্লিকেশন তৈরি",
        "কোড দিয়ে বাস্তব-বিশ্বের সমস্যা সমাধান",
      ],
      features: [
        "লাইভ কোডিং সেশন (সপ্তাহে ২বার)",
        "ইন্টারেক্টিভ কোডিং চ্যালেঞ্জ",
        "১০+ হাতে-কলমে প্রজেক্ট",
        "সাপ্তাহিক কোডিং অ্যাসাইনমেন্ট",
        "AI টুলকিট এবং রিসোর্স",
        "ইন্ডাস্ট্রি-স্বীকৃত সার্টিফিকেট",
        "AI প্রজেক্টের পোর্টফোলিও",
      ],
      careerBenefits: [
        "সফটওয়্যার ডেভেলপমেন্ট ক্যারিয়ারের ভিত্তি",
        "AI/ML ইঞ্জিনিয়ারিং রোলের দক্ষতা",
        "ডেটা সাইন্স ও অ্যানালিটিক্স সক্ষমতা",
        "প্রতিযোগিতামূলক প্রোগ্রামিং প্রস্তুতি",
        "বিশ্ববিদ্যালয়ে কম্পিউটার সাইন্সের প্রস্তুতি",
      ],
      syllabus: [
        {
          week: 1,
          title: "Python বেসিক",
          topics: [
            "ভেরিয়েবল এবং ডেটা টাইপ",
            "ইনপুট/আউটপুট",
            "বেসিক অপারেশন",
            "আপনার প্রথম Python প্রোগ্রাম",
          ],
        },
        {
          week: 2,
          title: "কন্ট্রোল ফ্লো",
          topics: [
            "If-else স্টেটমেন্ট",
            "লুপ (for, while)",
            "লজিক্যাল অপারেটর",
            "ইন্টারেক্টিভ প্রোগ্রাম",
          ],
        },
        {
          week: 3,
          title: "ফাংশন ও মডিউল",
          topics: [
            "ফাংশন ডিফাইন করা",
            "প্যারামিটার ও রিটার্ন ভ্যালু",
            "মডিউল ইম্পোর্ট করা",
            "কোড সংগঠন",
          ],
        },
        {
          week: 4,
          title: "ডেটা স্ট্রাকচার",
          topics: [
            "লিস্ট এবং টাপল",
            "ডিকশনারি ও সেট",
            "স্ট্রিং ম্যানিপুলেশন",
            "ডেটা প্রসেসিং",
          ],
        },
        {
          week: 5,
          title: "অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং",
          topics: [
            "ক্লাস এবং অবজেক্ট",
            "ইনহেরিটেন্স",
            "এনক্যাপসুলেশন",
            "পুনরায় ব্যবহারযোগ্য কোড তৈরি",
          ],
        },
        {
          week: 6,
          title: "ফাইল ও API এর সাথে কাজ",
          topics: [
            "ফাইল রিড/রাইট করা",
            "JSON ডেটা",
            "API ইন্টিগ্রেশন",
            "ওয়েব স্ক্র্যাপিং বেসিক",
          ],
        },
        {
          week: 7,
          title: "AI এর পরিচিতি",
          topics: [
            "AI এবং ML কী?",
            "লার্নিং এর প্রকারভেদ",
            "ডেটা প্রস্তুতি",
            "প্রথম AI মডেল",
          ],
        },
        {
          week: 8,
          title: "মেশিন লার্নিং বেসিক",
          topics: [
            "সুপারভাইজড লার্নিং",
            "ক্ল্যাসিফিকেশন সমস্যা",
            "scikit-learn ব্যবহার",
            "মডেল ট্রেনিং ও টেস্টিং",
          ],
        },
        {
          week: 9,
          title: "AI প্রজেক্ট",
          topics: [
            "চ্যাটবট তৈরি করা",
            "ইমেজ ক্ল্যাসিফিকেশন",
            "সেন্টিমেন্ট অ্যানালাইসিস",
            "রিকমেন্ডেশন সিস্টেম",
          ],
        },
        {
          week: 10,
          title: "ক্যাপস্টোন প্রজেক্ট",
          topics: [
            "আপনার AI অ্যাপ্লিকেশন ডিজাইন করুন",
            "ইমপ্লিমেন্টেশন",
            "টেস্টিং ও রিফাইনমেন্ট",
            "ফাইনাল উপস্থাপনা",
          ],
        },
      ],
    },
  },
];

export const getCourseSlug = (course: any): string => {
  if (!course) return "";
  if (course.slug) return course.slug;
  const title = (course.title || "").toLowerCase();
  const id = String(course._id || course.id || "");
  if (title.includes("python") || id === "69ce553ce9e96ed805295101") return "python-programming-for-teens";
  if (title.includes("robot") || title.includes("arduino") || id === "69ca5603e9e96ed80529474a") return "junior-robotics";
  return id;
};

export const findCourseDetail = (slugOrId: string): Course | undefined => {
  if (!slugOrId) return undefined;
  const s = slugOrId.toLowerCase().trim();
  const isPython = s.includes("python") || s === "69ce553ce9e96ed805295101";
  const isRobotics = s.includes("robot") || s.includes("arduino") || s === "69ca5603e9e96ed80529474a";

  return courses.find(c => 
    c.id === s || 
    c.slug === s || 
    (isPython && (c.id === "python-ai" || c.slug.includes("python"))) ||
    (isRobotics && (c.id === "robotics-arduino" || c.slug.includes("robotics")))
  );
};

export default courses;
