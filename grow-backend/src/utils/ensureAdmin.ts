import bcrypt from "bcryptjs";
import { User } from "../modules/user/model/user.model.js";
import { Course } from "../modules/course/model/course.model.js";
import { SiteContent } from "../modules/siteContent/model/siteContent.model.js";
import { ensureAllTutors } from "./ensureTutors.js";

export const ensureCourseMetadata = async () => {
  try {
    // 1. Python Programming for Teens
    await Course.updateMany(
      {
        $or: [
          { title: { $regex: /python/i } },
          { _id: "69ce553ce9e96ed805295101" }
        ]
      },
      {
        $set: {
          slug: "python-programming-for-teens",
          thumbnail: "/courses/python-course-banner.jpg",
          img: "/courses/python-course-banner.jpg",
          tags: ["Python", "AI", "Machine Learning", "Coding for Teens", "STEM", "Game Development"],
          learningOutcomes: [
            "Master Python 3 fundamentals: syntax, data types, logic, and functions",
            "Build interactive GUI games and automated command-line utilities",
            "Implement Object-Oriented Programming (OOP) with reusable classes",
            "Build real-world AI applications and intelligent chatbots with OpenAI APIs",
            "Work with external web APIs, JSON data, and file system automation",
            "Learn version control with Git & GitHub to showcase portfolio projects",
          ],
          prerequisites: [
            "No prior coding or programming experience required",
            "A laptop or desktop computer with internet access",
            "Curiosity and excitement to build real software applications",
          ],
        }
      }
    );

    // 2. Junior Robotics
    await Course.updateMany(
      {
        $or: [
          { title: { $regex: /robotics/i } },
          { _id: "69ca5603e9e96ed80529474a" }
        ]
      },
      {
        $set: {
          slug: "junior-robotics",
          thumbnail: "/courses/robotics-course-banner.jpg",
          img: "/courses/robotics-course-banner.jpg",
          tags: ["Robotics", "Arduino", "Electronics", "IoT", "Sensors", "STEM"],
          learningOutcomes: [
            "Master core electronics: breadboards, voltage, resistors, and circuit safety",
            "Program Arduino microcontrollers using C/C++ in Arduino IDE",
            "Integrate digital and analog sensors (Ultrasonic, IR, Temperature, LDR)",
            "Control DC motors, servo motors, and motor driver shields for movement",
            "Build an autonomous obstacle-avoiding robot and an intelligent line follower",
            "Develop practical engineering problem-solving and debugging skills",
          ],
          prerequisites: [
            "No prior electronics or programming experience required",
            "A computer (Windows, Mac, or Linux) with USB port for Arduino IDE",
            "Robotics Starter Kit (delivered by Learn & Grow)",
          ],
        }
      }
    );

    // 3. Remove dummy instructor accounts if any re-appeared
    await User.deleteMany({
      email: {
        $in: [
          "tanvir.robotics@learngrow.com",
          "sumaiya.python@learngrow.com",
          "mahmudul.coder@learngrow.com",
          "nafis.game@learngrow.com",
          "farhana.stem@learngrow.com",
          "arif.ai@learngrow.com",
        ],
      },
    });

    console.log("[Course Metadata] Course slugs and rich metadata verified.");
  } catch (error) {
    console.error("[Course Metadata] Error ensuring course metadata:", error);
  }
};

import { Event } from "../modules/event/model/event.model.js";
import { EventGuest } from "../modules/event/model/event-guest.model.js";

export const ensureEvents = async () => {
  try {
    const adminUser = await User.findOne({ role: "admin" }).lean();
    if (!adminUser) return;

    // 1. Ensure Event Guests
    let guestTanvir = await EventGuest.findOne({ fullName: { $regex: /Tanvir/i } });
    if (!guestTanvir) {
      guestTanvir = await EventGuest.create({
        fullName: "Md. Tanvir Hassan",
        role: "Lead Mentor & Judge",
        organization: "Daffodil International University (DIU)",
        designation: "Senior Robotics Lead",
        bio: "রোবটিক্স ও মেকাট্রনিক্স বিশেষজ্ঞ। দীর্ঘ সময় ধরে শিশু-কিশোরদের রোবটিক্স অলিম্পিয়াডের জাতীয় বিচারক হিসেবে দায়িত্ব পালন করছেন।",
        profileImage: "https://res.cloudinary.com/daq7v0wmf/image/upload/v1775260928/team/tanvir.jpg",
        email: "tanvir.lead@learngrow.io",
      });
    } else if (/buet/i.test(guestTanvir.organization || "")) {
      guestTanvir.organization = "Daffodil International University (DIU)";
      await guestTanvir.save();
    }

    let guestTonni = await EventGuest.findOne({ fullName: { $regex: /Tonni/i } });
    if (!guestTonni) {
      guestTonni = await EventGuest.create({
        fullName: "Tasnim Jahan Tonni",
        role: "Mentor",
        organization: "University of Asia Pacific (UAP)",
        designation: "Lead AI & Coding Mentor",
        bio: "কম্পিউটার সায়েন্স গ্র্যাজুয়েট ও অভিজ্ঞ প্রোগ্রামিং মেন্টর। শিশুদের এআই ও পাইথন কোডিং সহজ ভাষায় শেখাতে পারদর্শী।",
        profileImage: "https://res.cloudinary.com/daq7v0wmf/image/upload/v1775260928/team/tonni.jpg",
        email: "tonni.mentor@learngrow.io",
      });
    }

    // 2. Real STEM Events
    const realEvents = [
      {
        title: "National Junior Robotics & STEM Olympiad 2026",
        type: "Competition" as const,
        shortDescription: "সারা দেশের স্কুল-কলেজ শিক্ষার্থীদের জন্য জাতীয় জুনিয়র রোবটিক্স অলিম্পিয়াড। লাইন ফলোয়ার, রোবো সকার ও উদ্ভাবনী হার্ডওয়্যার শোকেস।",
        detailedDescription: `
          <div class="space-y-4">
            <p class="text-base leading-relaxed">জাতীয় জুনিয়র রোবটিক্স অলিম্পিয়াড ২০২৬ বাংলাদেশের স্কুল ও কলেজ পর্যায়ের ক্ষুদে উদ্ভাবকদের জন্য একটি অনন্য জাতীয় প্ল্যাটফর্ম। শিক্ষার্থীরা তাদের তৈরি স্বয়ংক্রিয় রোবট নিয়ে বিভিন্ন সেগমেন্টে সরাসরি প্রতিযোগিতায় অংশ নেবে।</p>
            <h3 class="text-lg font-bold text-gray-900">অলিম্পিয়াডের মূল সেগমেন্টসমূহ:</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>Line Follower Robot Challenge:</strong> নিজস্ব প্রোগ্রামিং ও সেন্সর ভিত্তিক স্বয়ংক্রিয় রোবট রেস ট্র্যাকে প্রতিযোগিতা।</li>
              <li><strong>Robo Soccer:</strong> ব্লুটুথ ও রেডিও কন্ট্রোলড রোবট দিয়ে উত্তেজনাপূর্ণ ফুটবল টুর্নামেন্ট।</li>
              <li><strong>Innovative STEM Project Showcase:</strong> বাস্তব সমস্যা সমাধানে তৈরি রোবটিক্স ও আইওটি হার্ডওয়্যার প্রজেক্ট প্রদর্শন।</li>
            </ul>
            <h3 class="text-lg font-bold text-gray-900">পুরস্কার ও সম্মাননা:</h3>
            <p>চ্যাম্পিয়ন ও রানার্স-আপ দলের জন্য থাকছে আকর্ষণীয় ট্রফি, মেডেল, ভেরিফায়েড সার্টিফিকেট, রোবটিক্স ডেভেলপমেন্ট কিট এবং মোট ৫০,০০০ টাকার প্রাইজপুল!</p>
          </div>
        `,
        bannerImage: "/courses/robotics-course-banner.jpg",
        eventDate: new Date("2026-11-28T09:30:00.000Z"),
        startTime: "09:30 AM",
        endTime: "05:30 PM",
        mode: "Offline" as const,
        venueName: "National Science and Technology Complex (বিজ্ঞান জাদুঘর)",
        venueAddress: "Agargaon, Sher-e-Bangla Nagar, Dhaka - 1207",
        googleMapLink: "https://maps.google.com/?q=National+Museum+of+Science+and+Technology+Dhaka",
        maxSeats: 150,
        registeredCount: 64,
        isRegistrationOpen: true,
        status: "Upcoming" as const,
        guests: [guestTanvir._id],
        createdBy: adminUser._id,
      },
      {
        title: "Teen AI & Python Chatbot Bootcamp 2026",
        type: "Bootcamp" as const,
        shortDescription: "৩ দিনের নিবিড় অনলাইন কোডিং বুটক্যাম্প। পাইথনের বেসিক থেকে শুরু করে ওপেনএআই এপিআই দিয়ে নিজস্ব এআই চ্যাটবট ডেপ্লয়মেন্টের লাইভ ল্যাব।",
        detailedDescription: `
          <div class="space-y-4">
            <p class="text-base leading-relaxed">টিনএজারদের জন্য বিশেষভাবে সাজানো ৩ দিনের হ্যান্ডস-অন পাইথন ও এআই বুটক্যাম্প। কোডিংয়ের হাতেখড়ি থেকে শুরু করে লাইভ মেন্টরশিপে রিয়েল-ওয়ার্ল্ড এআই প্রজেক্ট তৈরি করার পূর্ণাঙ্গ সুযোগ।</p>
            <h3 class="text-lg font-bold text-gray-900">বুটক্যাম্প কারিকুলাম:</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>Day 1:</strong> পাইথন ফান্ডামেন্টালস, ভ্যারিয়েবল, লজিক বিল্ডিং ও কমান্ড-লাইন গেম তৈরি।</li>
              <li><strong>Day 2:</strong> অবজেক্ট-ওরিয়েন্টেড প্রোগ্রামিং ও Pygame দিয়ে ইন্টারেক্টিভ ২ডি গেম মেকিং।</li>
              <li><strong>Day 3:</strong> OpenAI API ইন্টিগ্রেশন ও নিজস্ব ইন্টেলিজেন্ট এআই চ্যাটবট তৈরি ও লাইভ ডেপ্লয়মেন্ট।</li>
            </ul>
            <p>সকল অংশগ্রহণকারী পাবেন অফিশিয়াল সার্টিফিকেট, ক্লাস রেকর্ডিং ও গিটহাব সোর্স কোড রিপোজিটরি।</p>
          </div>
        `,
        bannerImage: "/courses/python-course-banner.jpg",
        eventDate: new Date("2026-11-14T18:00:00.000Z"),
        startTime: "06:00 PM",
        endTime: "09:00 PM",
        mode: "Online" as const,
        platformType: "Zoom" as const,
        meetingLink: "https://zoom.us/j/learngrow-ai-bootcamp",
        platformInstructions: "ক্লাসে যোগদানের আগে ল্যাপটপ বা কম্পিউটারে জুম অ্যাপ ও ভিএস কোড প্রস্তুত রাখুন।",
        maxSeats: 80,
        registeredCount: 35,
        isRegistrationOpen: true,
        status: "Upcoming" as const,
        guests: [guestTonni._id],
        createdBy: adminUser._id,
      },
      {
        title: "Hands-on Arduino & Sensor Circuit Workshop",
        type: "Workshop" as const,
        shortDescription: "ধানমন্ডি ল্যাবে সরাসরি হার্ডওয়্যার দিয়ে সার্কিট মেকিং ও রোবটিক্স সেন্সর কোডিং কর্মশালা। প্রতিটি শিক্ষার্থীর জন্য নিজস্ব কিট ওয়ার্কস্টেশন।",
        detailedDescription: `
          <div class="space-y-4">
            <p class="text-base leading-relaxed">শিশুদের ইলেকট্রনিক্স ও সার্কিটের প্রতি ভীতি দূর করে বাস্তব যন্ত্রপাতি দিয়ে কাজ শেখানোর ১ দিনের প্র্যাকটিক্যাল কর্মশালা।</p>
            <h3 class="text-lg font-bold text-gray-900">কর্মশালায় যা যা থাকবে:</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>ব্রেডবোর্ড, রেজিস্টর, এলইডি ও জাম্পার ওয়্যার সংযোগের নিয়মাবলী।</li>
              <li>আল্ট্রাসনিক ও আইআর সেন্সর দিয়ে স্বয়ংক্রিয় বাধা শনাক্তকরণ সার্কিট।</li>
              <li>সার্ভো মোটর কন্ট্রোল করে স্বয়ংক্রিয় ব্যারিয়ার গেট তৈরি।</li>
            </ul>
            <p>সকল হার্ডওয়্যার ল্যাব থেকে সরবরাহ করা হবে এবং সফলভাবে সম্পন্নকারীকে সার্টিফিকেট প্রদান করা হবে।</p>
          </div>
        `,
        bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop",
        eventDate: new Date("2026-11-07T15:00:00.000Z"),
        startTime: "03:00 PM",
        endTime: "06:30 PM",
        mode: "Offline" as const,
        venueName: "Learn & Grow STEM Lab",
        venueAddress: "Level 4, 35 Green Road, Dhanmondi, Dhaka - 1205",
        googleMapLink: "https://maps.google.com/?q=Dhanmondi+Green+Road+Dhaka",
        maxSeats: 30,
        registeredCount: 19,
        isRegistrationOpen: true,
        status: "Upcoming" as const,
        guests: [guestTanvir._id],
        createdBy: adminUser._id,
      },
      {
        title: "Future of Kids Education: Screen Time to STEM Creators",
        type: "Seminar" as const,
        shortDescription: "অভিভাবকদের জন্য উন্মুক্ত লাইভ সেমিনার: প্রযুক্তির যুগে সন্তানের স্ক্রিন আসক্তি কমিয়ে কীভাবে সৃজনশীল কোডিং ও রোবটিক্সে উদ্বুদ্ধ করবেন?",
        detailedDescription: `
          <div class="space-y-4">
            <p class="text-base leading-relaxed">আজকের ডিজিটাল যুগে শিশু-কিশোরদের মোবাইল ও গেমের প্রতি অতিরিক্ত আসক্তি প্রতিটি অভিভাবকের জন্য বড় চিন্তার কারণ। এই উন্মুক্ত সেমিনারে আমরা আলোচনা করব কীভাবে এই আগ্রহকে ভবিষ্যৎমুখী গঠনমূলক দক্ষতায় রূপান্তর করা যায়।</p>
            <h3 class="text-lg font-bold text-gray-900">আলোচনার মূল দিকসমূহ:</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>স্ক্রিন টাইম বনাম স্কিল টাইম: ইতিবাচক প্রযুক্তি ব্যবহারের বৈজ্ঞানিক উপায়।</li>
              <li>কোন বয়সে কোডিং বা রোবটিক্স শুরু করা সবচেয়ে কার্যকরী?</li>
              <li>এআই ও অটোমেশনের যুগে ২০৩০ সালের জন্য প্রয়োজনীয় ৩টি কোর স্কিল।</li>
              <li>সরাসরি মেন্টর ও শিক্ষা বিশেষজ্ঞদের সাথে প্রশ্নোত্তর পর্ব।</li>
            </ul>
          </div>
        `,
        bannerImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        eventDate: new Date("2026-11-21T20:00:00.000Z"),
        startTime: "08:00 PM",
        endTime: "09:30 PM",
        mode: "Online" as const,
        platformType: "Zoom" as const,
        meetingLink: "https://zoom.us/j/learngrow-parents-seminar",
        platformInstructions: "সকল অভিভাবক ও শিক্ষার্থীদের জন্য উন্মুক্ত। জুম লিংকের মাধ্যমে সরাসরি যুক্ত হন।",
        maxSeats: 200,
        registeredCount: 112,
        isRegistrationOpen: true,
        status: "Upcoming" as const,
        guests: [guestTonni._id, guestTanvir._id],
        createdBy: adminUser._id,
      },
      {
        title: "Build Your First AI Chatbot in Python (Free Live Trial Class)",
        type: "Workshop" as const,
        shortDescription: "১ ঘণ্টার ফ্রি লাইভ প্র্যাকটিক্যাল কোডিং সেশন (বয়স ১০-১৬)। কোনো পূর্ব অভিজ্ঞতা ছাড়াই পাইথনের বেসিক শিখে তৈরি করুন নিজস্ব এআই চ্যাটবট।",
        detailedDescription: `
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">সেশনের মূল উদ্দেশ্য</h3>
              <p class="text-base text-gray-700 leading-relaxed">
                এআই-এর যুগে আপনার সন্তানকে শুধু প্রযুক্তির ব্যবহারকারী না বানিয়ে মেকার হিসেবে গড়ে তুলতে Learn & Grow নিয়ে এসেছে ১ ঘণ্টার স্পেশাল ফ্রি লাইভ পাইথন কোডিং ওয়ার্কশপ। কোনো পূর্ব অভিজ্ঞতা ছাড়াই, শিক্ষার্থীরা পাইথনের বেসিক (Syntax, Variables, Conditions) শিখে সরাসরি নিজস্ব একটি কাস্টম AI Chatbot তৈরি করবে।
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
                <h4 class="font-bold text-sm text-blue-900 mb-1">লাইভ প্রজেক্ট মেকিং</h4>
                <p class="text-xs text-blue-800 leading-relaxed">সরাসরি ব্রাউজারে কোড লিখে বুদ্ধিমান চ্যাটবট তৈরি ও রান করার বাস্তব অভিজ্ঞতা।</p>
              </div>
              <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                <h4 class="font-bold text-sm text-amber-900 mb-1">১০-১৫ জনের ছোট ব্যাচ</h4>
                <p class="text-xs text-amber-800 leading-relaxed">প্রতিটি শিক্ষার্থী পাবে ওয়ান-টু-ওয়ান সহায়তা ও ইনস্ট্যান্ট কোড ডিবাগিং গাইডেন্স।</p>
              </div>
              <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
                <h4 class="font-bold text-sm text-purple-900 mb-1">সার্টিফিকেট ও অ্যাসেসমেন্ট</h4>
                <p class="text-xs text-purple-800 leading-relaxed">সফলভাবে সম্পন্ন করার পর ভেরিফায়েড সার্টিফিকেট এবং প্রজেক্ট ফাইল প্রদান করা হবে।</p>
              </div>
              <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <h4 class="font-bold text-sm text-emerald-900 mb-1">এক্সক্লুসিভ স্কলারশিপ</h4>
                <p class="text-xs text-emerald-800 leading-relaxed">ট্রায়াল ক্লাসের সেরা পারফর্মারদের জন্য ১২ সপ্তাহের পূর্ণাঙ্গ কোর্সে বিশেষ ছাড়।</p>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-3">সেশন টাইমলাইন (১ ঘণ্টা)</h3>
              <div class="space-y-2.5">
                <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-200 text-gray-800">প্রথম ১৫ মি.</span>
                  <div>
                    <h5 class="font-bold text-sm text-gray-900">পরিচিতি ও পাইথনের বেসিক ফান্ডামেন্টালস</h5>
                    <p class="text-xs text-gray-600">ভ্যারিয়েবল, ইনপুট/আউটপুট এবং কন্ডিশনাল লজিক বোঝা।</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800">পরবর্তী ৩০ মি.</span>
                  <div>
                    <h5 class="font-bold text-sm text-gray-900">হ্যান্ডস-অন কোডিং ল্যাব: এআই চ্যাটবট তৈরি</h5>
                    <p class="text-xs text-gray-600">মেন্টরের সাথে সাথে স্টেপ-বাই-স্টেপ এআই রেসপন্স সিস্টেম কোডিং।</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800">শেষ ১৫ মি.</span>
                  <div>
                    <h5 class="font-bold text-sm text-gray-900">সরাসরি প্রশ্নোত্তর, ক্যারিয়ার গাইডেন্স ও সার্টিফিকেট</h5>
                    <p class="text-xs text-gray-600">অভিভাবক ও শিক্ষার্থীদের প্রশ্নের উত্তর এবং পরবর্তী শেখার রোডম্যাপ।</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">ক্লাসের প্রস্তুতি</h3>
              <ul class="list-disc pl-5 space-y-1.5 text-sm text-gray-700">
                <li>একটি সচল ল্যাপটপ বা কম্পিউটার (উইন্ডোজ, ম্যাক বা লিনাক্স)।</li>
                <li>ইন্টারনেট কানেকশন এবং গুগল ক্রোম ব্রাউজার।</li>
                <li>কথা বলার জন্য হেডফোন বা মাইক্রোফোন (বাধ্যতামূলক নয়, তবে বাঞ্ছনীয়)।</li>
                <li>কোনো পূর্ব কোডিং অভিজ্ঞতার প্রয়োজন নেই — একদম শুরু থেকে শেখানো হবে।</li>
              </ul>
            </div>
          </div>
        `,
        bannerImage: "/courses/python-course-banner.jpg",
        eventDate: new Date("2026-10-24T13:00:00.000Z"),
        startTime: "07:00 PM",
        endTime: "08:00 PM",
        mode: "Online" as const,
        platformType: "Google Meet" as const,
        meetingLink: "https://meet.google.com/smr-qqhn-sox",
        platformInstructions: "ক্লাস শুরুর ১০ মিনিট পূর্বে গুগল মিট রুমে যুক্ত হন। ল্যাপটপ থেকে জয়েন করা উত্তম।",
        maxSeats: 30,
        registeredCount: 14,
        isRegistrationOpen: true,
        status: "Upcoming" as const,
        guests: [guestTonni._id],
        createdBy: adminUser._id,
      },
    ];

    for (const item of realEvents) {
      const existing = await Event.findOne({
        $or: [
          { title: item.title },
          { title: { $regex: new RegExp(item.title.split(" ")[0] + ".*" + item.title.split(" ")[1], "i") } }
        ]
      });
      if (existing) {
        await Event.updateOne({ _id: existing._id }, { $set: item });
      } else {
        await Event.create(item);
      }
    }

    console.log("[Events Seeder] 4 Real STEM events verified and seeded.");
  } catch (error) {
    console.error("[Events Seeder] Error seeding events:", error);
  }
};

export const ensureSitePolicies = async () => {
  try {
    const policies = [
      {
        page: "privacy-policy",
        defaultHtml: `
<div class="space-y-6">
  <p class="text-sm text-gray-500">সর্বশেষ আপডেট: অক্টোবর ১৮, ২০২৬ | Last Updated: October 18, 2026</p>
  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">১. ভূমিকা ও তথ্যের সুরক্ষা (Introduction)</h2>
    <p class="text-gray-700 leading-relaxed">Learn & Grow (ওয়েবসাইট: <a href="https://learnandgrow.io" class="text-blue-600 underline">https://learnandgrow.io</a>) শিক্ষার্থীদের, বিশেষ করে শিশু ও কিশোরদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা ও নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। এই পলিসিতে বিস্তারিত ব্যাখ্যা করা হয়েছে কীভাবে আমরা আপনার তথ্য সংগ্রহ, সংরক্ষণ, ব্যবহার ও সুরক্ষিত রাখি।</p>
  </section>
  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">২. আমরা যেসব তথ্য সংগ্রহ করি (Information We Collect)</h2>
    <ul class="list-disc pl-5 space-y-1.5 text-gray-700">
      <li><strong>অ্যাকাউন্ট তথ্য:</strong> শিক্ষার্থী ও অভিভাবকের নাম, ইমেইল ঠিকানা, ফোন নম্বর এবং বয়স/শ্রেণি।</li>
      <li><strong>শেখার অগ্রগতি:</strong> ক্লাসে উপস্থিতি, হোমওয়ার্ক সাবমিশন, কুইজ রেজাল্ট ও ব্যাচ শিডিউল।</li>
      <li><strong>পেমেন্ট ও ডেলিভারি:</strong> লেনদেনের ট্রানজ্যাকশন আইডি ও রোবটিক্স কিট ডেলিভারির ঠিকানা।</li>
    </ul>
  </section>
  <section class="space-y-3 bg-blue-50/60 p-6 rounded-2xl border border-blue-100">
    <h2 class="text-lg font-bold text-blue-900">৩. প্রাইভেসী ও ডেটা প্রটেকশন অফিসার যোগাযোগ (Contact Us)</h2>
    <p class="text-sm text-blue-800 leading-relaxed mb-3">প্রাইভেসী পলিসি বা আপনার ডেটা সম্পর্কিত যেকোনো প্রশ্ন বা অনুরোধের জন্য যোগাযোগ করুন:</p>
    <ul class="text-sm text-blue-900 space-y-1 font-medium">
      <li>• <strong>প্রাইভেসী ইনকোয়ারি:</strong> <a href="mailto:privacy@learnandgrow.io" class="underline font-bold text-blue-600">privacy@learnandgrow.io</a></li>
      <li>• <strong>ডেটা প্রটেকশন অফিসার (DPO):</strong> <a href="mailto:dpo@learnandgrow.io" class="underline font-bold text-blue-600">dpo@learnandgrow.io</a></li>
      <li>• <strong>গ্রাহক সেবা:</strong> <a href="mailto:support@learnandgrow.io" class="underline font-bold text-blue-600">support@learnandgrow.io</a></li>
    </ul>
  </section>
</div>
        `.trim(),
      },
      {
        page: "terms-of-use",
        defaultHtml: `
<div class="space-y-6">
  <p class="text-sm text-gray-500">কার্যকরী তারিখ: অক্টোবর ১৮, ২০২৬ | Effective Date: October 18, 2026</p>
  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">১. প্ল্যাটফর্ম ব্যবহার নীতিমালা (Acceptance of Terms)</h2>
    <p class="text-gray-700 leading-relaxed">Learn & Grow (ওয়েবসাইট: <a href="https://learnandgrow.io" class="text-blue-600 underline">https://learnandgrow.io</a>) ব্যবহার করার মাধ্যমে আপনি এবং আপনার অভিভাবক এই শর্তাবলী সম্পূর্ণভাবে মেনে নিচ্ছেন। প্ল্যাটফর্মটি শিশু ও কিশোরদের ইন্টারঅ্যাক্টিভ কোডিং, রোবটিক্স ও স্টেম শিক্ষার জন্য নির্মিত।</p>
  </section>
  <section class="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
    <h2 class="text-lg font-bold text-gray-900">২. আইনি ও প্রাতিষ্ঠানিক যোগাযোগ (Legal Inquiries)</h2>
    <ul class="text-sm text-gray-800 space-y-1 font-medium">
      <li>• <strong>আইনি বিভাগ:</strong> <a href="mailto:legal@learnandgrow.io" class="underline font-bold text-blue-600">legal@learnandgrow.io</a></li>
      <li>• <strong>সাধারণ তথ্য:</strong> <a href="mailto:info@learnandgrow.io" class="underline font-bold text-blue-600">info@learnandgrow.io</a></li>
      <li>• <strong>হেল্পলাইন:</strong> <a href="mailto:support@learnandgrow.io" class="underline font-bold text-blue-600">support@learnandgrow.io</a></li>
    </ul>
  </section>
</div>
        `.trim(),
      },
      {
        page: "refund-policy",
        defaultHtml: `
<div class="space-y-6">
  <p class="text-sm text-gray-500">সর্বশেষ সংস্করণ: অক্টোবর ১৮, ২০২৬ | Version Date: October 18, 2026</p>
  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">১. আমাদের প্রতিশ্রুতি ও রিফান্ড গ্যারান্টি (Money-Back Guarantee)</h2>
    <p class="text-gray-700 leading-relaxed">Learn & Grow-এ আমাদের প্রতিটি কোর্স ১০০% লাইভ প্র্যাকটিক্যাল ল্যাবে পরিচালিত হয়। আপনি যদি কোর্সের প্রথম ২টি ক্লাসের পর সন্তুষ্ট না হন, তবে কোনো শর্ত ছাড়াই ১০০% অর্থ ফেরতের আবেদন করতে পারবেন।</p>
  </section>
  <section class="space-y-3 bg-emerald-50/60 p-6 rounded-2xl border border-emerald-100">
    <h2 class="text-lg font-bold text-emerald-900">২. রিফান্ডের আবেদন পাঠানোর মাধ্যম (How to Request a Refund)</h2>
    <ul class="text-sm text-emerald-900 space-y-1.5 font-medium">
      <li>• <strong>রিফান্ড ও হিসাব বিভাগ:</strong> <a href="mailto:refund@learnandgrow.io" class="underline font-bold text-emerald-700">refund@learnandgrow.io</a></li>
      <li>• <strong>বিলিং সহায়তা:</strong> <a href="mailto:billing@learnandgrow.io" class="underline font-bold text-emerald-700">billing@learnandgrow.io</a></li>
      <li>• <strong>গ্রাহক সেবা ডেস্ক:</strong> <a href="mailto:support@learnandgrow.io" class="underline font-bold text-emerald-700">support@learnandgrow.io</a></li>
      <li>• <strong>হোয়াটসঅ্যাপ হেল্পলাইন:</strong> <a href="https://wa.me/8801706276447" target="_blank" class="underline font-bold text-emerald-700">+880 1706-276447</a> (সকাল ১০টা - সন্ধ্যা ৬টা, শনি-বৃহস্পতি / Business hours: 10 AM - 6 PM, Sat-Thu)</li>
    </ul>
  </section>
</div>
        `.trim(),
      },
      {
        page: "cookie-policy",
        defaultHtml: `
<div class="space-y-6">
  <p class="text-sm text-gray-500">সর্বশেষ সংস্করণ: অক্টোবর ১৮, ২০২৬ | Last Updated: October 18, 2026</p>
  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">১. কুকি নীতি (Cookie Policy)</h2>
    <p class="text-gray-700 leading-relaxed">কুকি হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত হয় যাতে প্ল্যাটফর্মে আপনার লগইন সেশন ও ভাষা অগ্রাধিকার সুরক্ষিত থাকে।</p>
  </section>
  <section class="space-y-3 bg-amber-50/60 p-6 rounded-2xl border border-amber-100">
    <h2 class="text-lg font-bold text-amber-900">২. যোগাযোগ</h2>
    <ul class="text-sm text-amber-900 space-y-1 font-medium">
      <li>• <strong>প্রাইভেসী ডেস্ক:</strong> <a href="mailto:privacy@learnandgrow.io" class="underline font-bold text-amber-700">privacy@learnandgrow.io</a></li>
      <li>• <strong>সহায়তা:</strong> <a href="mailto:support@learnandgrow.io" class="underline font-bold text-amber-700">support@learnandgrow.io</a></li>
      <li>• <strong>হোয়াটসঅ্যাপ হেল্পলাইন:</strong> <a href="https://wa.me/8801706276447" target="_blank" class="underline font-bold text-amber-700">+880 1706-276447</a> (সকাল ১০টা - সন্ধ্যা ৬টা, শনি-বৃহস্পতি / Business hours: 10 AM - 6 PM, Sat-Thu)</li>
    </ul>
  </section>
</div>
        `.trim(),
      },
    ];

    for (const p of policies) {
      const existing = await SiteContent.findOne({ page: p.page });
      if (!existing || !existing.content || (typeof existing.content === "string" && existing.content.trim() === "")) {
        await SiteContent.findOneAndUpdate(
          { page: p.page },
          { $set: { content: p.defaultHtml } },
          { upsert: true, new: true }
        );
        console.log(`[Site Content Seeder] Seeded default policy for ${p.page} with @learnandgrow.io emails & WhatsApp.`);
      } else if (typeof existing.content === "string") {
        // Replace any outdated domains with learnandgrow.io and update phone to WhatsApp
        let updated = existing.content
          .replace(/@learn-grow\.com/gi, "@learnandgrow.io")
          .replace(/@learngrowedu\.com/gi, "@learnandgrow.io")
          .replace(/@learngrow\.academy/gi, "@learnandgrow.io")
          .replace(/@learngrow\.com/gi, "@learnandgrow.io")
          .replace(/Phone:\s*\+880-X+-[X]+[^\n<]*/gi, '<strong>হোয়াটসঅ্যাপ হেল্পলাইন:</strong> <a href="https://wa.me/8801706276447" target="_blank" class="underline font-bold text-emerald-700">+880 1706-276447</a> (সকাল ১০টা - সন্ধ্যা ৬টা, শনি-বৃহস্পতি / Business hours: 10 AM - 6 PM, Sat-Thu)')
          .replace(/\+880-XXXX-XXXXXX/gi, "+880 1706-276447")
          .replace(/\+880 1886-064560/gi, "+880 1706-276447")
          .replace(/8801886064560/gi, "8801706276447");
        if (updated !== existing.content) {
          existing.content = updated;
          await existing.save();
          console.log(`[Site Content Seeder] Updated contact info in ${p.page} to @learnandgrow.io and WhatsApp +880 1706-276447.`);
        }
      }
    }

    // Also verify contact page and press page emails in database
    const contactDoc = await SiteContent.findOne({ page: "contact" });
    if (contactDoc && typeof contactDoc.content === "object" && contactDoc.content.info) {
      let changed = false;
      if (contactDoc.content.info.email && !contactDoc.content.info.email.endsWith("@learnandgrow.io")) {
        contactDoc.content.info.email = "info@learnandgrow.io";
        changed = true;
      }
      if (contactDoc.content.info.phone !== "+880 1706-276447") {
        contactDoc.content.info.phone = "+880 1706-276447";
        changed = true;
      }
      if (contactDoc.content.info.whatsapp !== "+880 1706-276447") {
        contactDoc.content.info.whatsapp = "+880 1706-276447";
        changed = true;
      }
      if (contactDoc.content.info.hours !== "Sat-Thu 10:00 AM - 6:00 PM (BST)") {
        contactDoc.content.info.hours = "Sat-Thu 10:00 AM - 6:00 PM (BST)";
        changed = true;
      }
      if (changed) {
        contactDoc.markModified("content");
        await contactDoc.save();
        console.log("[Site Content Seeder] Updated contact page details to +880 1706-276447 & official email.");
      }
    }

    const pressDoc = await SiteContent.findOne({ page: "press" });
    if (!pressDoc) {
      await SiteContent.create({
        page: "press",
        content: {
          mediaContact: {
            email: "press@learnandgrow.io",
            whatsapp: "https://wa.me/8801706276447",
            phone: "+880 1706-276447"
          }
        }
      });
      console.log("[Site Content Seeder] Seeded default press document with press@learnandgrow.io.");
    } else {
      let changed = false;
      if (typeof pressDoc.content === "string") {
        try {
          const parsed = JSON.parse(pressDoc.content);
          if (parsed && typeof parsed === "object") {
            if (!parsed.mediaContact) parsed.mediaContact = {};
            if (parsed.mediaContact.email !== "press@learnandgrow.io") {
              parsed.mediaContact.email = "press@learnandgrow.io";
              changed = true;
            }
            if (changed) {
              pressDoc.content = parsed;
            }
          }
        } catch {
          let updated = pressDoc.content
            .replace(/press@learn-grow\.com/gi, "press@learnandgrow.io")
            .replace(/press@learngrowedu\.com/gi, "press@learnandgrow.io")
            .replace(/press@learngrow\.academy/gi, "press@learnandgrow.io")
            .replace(/press@learngrow\.com/gi, "press@learnandgrow.io");
          if (updated !== pressDoc.content) {
            pressDoc.content = updated;
            changed = true;
          }
        }
      } else if (typeof pressDoc.content === "object" && pressDoc.content !== null) {
        if (!pressDoc.content.mediaContact) {
          pressDoc.content.mediaContact = {};
        }
        if (pressDoc.content.mediaContact.email !== "press@learnandgrow.io") {
          pressDoc.content.mediaContact.email = "press@learnandgrow.io";
          changed = true;
        }
      }
      if (changed) {
        pressDoc.markModified("content");
        await pressDoc.save();
        console.log("[Site Content Seeder] Updated press page email to press@learnandgrow.io.");
      }
    }

    console.log("[Site Content Seeder] All site legal and contact emails verified under @learnandgrow.io.");
  } catch (error) {
    console.error("[Site Content Seeder] Error ensuring site policies:", error);
  }
};

export const ensureAdminUsers = async () => {
  try {
    const adminEmails = ["admin@learn-grow.com", "admin@learngrow.com", "admin@learnandgrow.io"];
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    for (const email of adminEmails) {
      const existingUser = await User.findOne({ 
        email: { $regex: new RegExp(`^${email.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i") } 
      });

      if (existingUser) {
        // SECURITY FIX: Never overwrite existing admin passwords on server boot!
        let changed = false;
        if (existingUser.role !== "admin") {
          existingUser.role = "admin";
          changed = true;
        }
        if (!existingUser.isVerified) {
          existingUser.isVerified = true;
          changed = true;
        }
        if (!existingUser.isApproved) {
          existingUser.isApproved = true;
          changed = true;
        }
        if (existingUser.isBlocked) {
          existingUser.isBlocked = false;
          changed = true;
        }
        if (changed) {
          await existingUser.save();
          console.log(`[Admin Seeder] Verified admin privileges for ${email}`);
        }
      } else {
        await User.create({
          name: "System Admin",
          email,
          password: hashedPassword,
          role: "admin",
          phone: email.includes("learn-grow") ? "01700000001" : "01700000002",
          isVerified: true,
          isApproved: true,
          isBlocked: false,
        });
        console.log(`[Admin Seeder] Created new admin user for ${email}`);
      }
    }

    await ensureCourseMetadata();
    await ensureEvents();
    await ensureAllTutors();
    await ensureSitePolicies();

    // Fix phone conflict: +393463275710 belongs to CEO/Founder Md Jabed Hosen (m.riyad3834@gmail.com)
    await User.updateOne(
      { email: "tasnimtonni024@gmail.com", phone: { $regex: /3463275710/ } },
      { $set: { phone: "+8801700000024" } }
    );

    try {
      const { syncExistingEnrollmentsToBatches } = await import("../modules/batch/service/batch.service.js");
      await syncExistingEnrollmentsToBatches();
    } catch (batchSyncErr) {
      console.error("[Batch Seeder] Failed to sync batches:", batchSyncErr);
    }
  } catch (error) {
    console.error("[Admin Seeder] Failed to ensure admin users:", error);
  }
};

