import bcrypt from "bcryptjs";
import { User } from "../modules/user/model/user.model.js";
import { Course } from "../modules/course/model/course.model.js";
import { SiteContent } from "../modules/siteContent/model/siteContent.model.js";
import { ensureAllTutors } from "./ensureTutors.js";

export const ensureCourseMetadata = async () => {
  try {
    // Lookup authentic instructors
    const tanvir = await User.findOne({ email: "tanvirhassan1201@gmail.com" });
    const jabed = await User.findOne({ email: "m.riyad3834@gmail.com" });
    const tonni = await User.findOne({ email: "tasnimtonni024@gmail.com" });
    const saiful = await User.findOne({ email: "saifulislam@learngrow.academy" });
    const shakil = await User.findOne({ email: "shakilrana@learngrow.academy" });
    const shovan = await User.findOne({ email: "shovanparvez@learngrow.academy" });
    const mehedi = await User.findOne({ email: "mehedihasan@learngrow.academy" });

    const fallbackInstructor = tanvir?._id || jabed?._id;

    const coreCourses = [
      {
        slug: "junior-robotics",
        title: "Junior Robotics with Arduino",
        category: "Robotics",
        level: "Beginner" as const,
        price: 3499,
        discountPrice: 2999,
        duration: 64,
        maxBatchSize: 15,
        type: "live" as const,
        language: "Bangla & English",
        isPublished: true,
        isAdminApproved: true,
        isFeatured: true,
        isRegistrationOpen: true,
        thumbnail: "/courses/robotics-course-banner.jpg",
        description:
          "<p><strong>Junior Robotics</strong> একটি মজাদার এবং শিক্ষণীয় কোর্স, যা ছোটদের রোবট তৈরির রোমাঞ্চকর জগতের সাথে পরিচয় করিয়ে দেয়। এই কোর্সে শিক্ষার্থীরা কেবল তাত্ত্বিক জ্ঞান নয়, বরং সরাসরি <strong>hands-on</strong> কাজের মাধ্যমে শিখবে কীভাবে একটি রোবট কাজ করে। আমরা এখানে <strong>“Sense → Think → Act”</strong> মডেল অনুসরণ করি—যেখানে একটি রোবট <strong>Sensors</strong> দিয়ে তথ্য নেয়, <strong>Programming</strong> দিয়ে চিন্তা করে এবং <strong>Motors</strong> দিয়ে কাজ সম্পন্ন করে।</p><p><strong>শিক্ষার্থীরা এই কোর্সে যা যা শিখবে:</strong></p><ul><li><strong>Robot Building:</strong> একটি পূর্ণাঙ্গ রোবট কিট নিজে হাতে অ্যাসেম্বল (Assemble) করা।</li><li><strong>Hardware Basics:</strong> হাব, মোটর এবং বিভিন্ন সেন্সরের ব্যবহার।</li><li><strong>Logical Coding:</strong> ব্লক কোডিং ও স্ক্র্যাচ দিয়ে রোবট পরিচালনা।</li><li><strong>Real-world Projects:</strong> অবস্ট্যাকল এভয়ডার এবং লাইন ফলোয়ার রোবট তৈরি।</li></ul><p><strong><a href=\"https://docs.google.com/document/d/12OdriIvJjhzPDD9vqx3F1NXSXdbRlDw6/edit?usp=sharing\" target=\"_blank\" rel=\"noopener noreferrer\">Download Curriculum</a></strong></p>",
        tags: ["Robotics", "Arduino", "Electronics", "IoT", "Sensors", "STEM"],
        learningOutcomes: [
          "একটি পূর্ণাঙ্গ রোবট কিট নিজে হাতে অ্যাসেম্বল (Assemble) করা",
          "সার্কিট ডিজাইন, ভোল্টেজ, রেজিস্টর ও ইলেকট্রনিক্স ফান্ডামেন্টালস আয়ত্ত করা",
          "আল্ট্রাসনিক ও আইআর সেন্সর দিয়ে দূরত্ব ও লাইন ডিটেকশন শেখা",
          "ডিসি মোটর ও মোটর ড্রাইভার শিল্ড দিয়ে রোবট মুভমেন্ট কন্ট্রোল করা",
          "স্বয়ংক্রিয় অবস্ট্যাকল এভয়ডার এবং ইন্টেলিজেন্ট লাইন ফলোয়ার রোবট তৈরি",
          "ইঞ্জিনিয়ারিং প্রবলেম-সলভিং ও ডিবাগিং দক্ষতা অর্জন",
        ],
        prerequisites: [
          "কোনো পূর্ব ইলেকট্রনিক্স বা কোডিং অভিজ্ঞতার প্রয়োজন নেই",
          "কম্পিউটার বা ল্যাপটপ (উইন্ডোজ, ম্যাক বা লিনাক্স)",
          "লার্ন অ্যান্ড গ্রো রোবটিক্স স্টার্টার কিট (বাসায় হোম ডেলিভারি)",
        ],
        instructorId: tanvir?._id || fallbackInstructor,
        instructorIds: [tanvir?._id || fallbackInstructor, shovan?._id || fallbackInstructor].filter(Boolean),
      },
      {
        slug: "python-programming-for-teens",
        title: "Coding with Python & AI for Teens",
        category: "Programming",
        level: "Intermediate" as const,
        price: 2999,
        discountPrice: 2499,
        duration: 48,
        maxBatchSize: 15,
        type: "live" as const,
        language: "Bangla & English",
        isPublished: true,
        isAdminApproved: true,
        isFeatured: true,
        isRegistrationOpen: true,
        thumbnail: "/courses/python-course-banner.jpg",
        description:
          "<p><strong>Python Programming & AI for Teens</strong> একটি প্র্যাকটিক্যাল এবং প্রজেক্ট-ভিত্তিক কোডিং কোর্স। একদম শূন্য থেকে শুরু করে টিনএজারদের জন্য সহজ বাংলায় বাস্তব সফটওয়্যার ও এআই অ্যাপ্লিকেশন তৈরির উপযোগী করে কারিকুলামটি সাজানো হয়েছে।</p><p><strong>শিক্ষার্থীরা এই কোর্সে যা যা শিখবে:</strong></p><ul><li><strong>Python Fundamentals:</strong> সিনট্যাক্স, ভ্যারিয়েবল, ডেটা টাইপ, ইনপুট/আউটপুট এবং কন্ডিশনাল লজিক।</li><li><strong>Data Structures & Visuals:</strong> লিস্ট, ডিকশনারি, লুপস এবং টার্টল গ্রাফিক্স দিয়ে অ্যালগরিদম ও ভিজ্যুয়াল প্যাটার্ন ডিজাইন।</li><li><strong>Functions & Clean Code:</strong> রিইউজেবল কোড ব্লক ও এরর হ্যান্ডলিং।</li><li><strong>AI & Capstone Project:</strong> এআই চ্যাটবট তৈরি ও নিজস্ব অরিজিনাল ক্যাপস্টোন প্রজেক্ট প্রেজেন্টেশন।</li></ul>",
        tags: ["Python", "AI", "Machine Learning", "Coding for Teens", "STEM", "Software"],
        learningOutcomes: [
          "পাইথন ৩ ফান্ডামেন্টালস: সিনট্যাক্স, ভ্যারিয়েবল, ডেটা টাইপ, ইনপুট/আউটপুট ও লজিক",
          "লিস্ট ও ডিকশনারি ডেটা স্ট্রাকচার দিয়ে বাস্তব ডেটা ম্যানেজমেন্ট",
          "টার্টল গ্রাফিক্স দিয়ে ক্রিয়েটিভ আর্ট ও জ্যামিতিক সফটওয়্যার তৈরি",
          "রিইউজেবল ফাংশন, মডিউল এবং ক্লিন কোডিং স্ট্যান্ডার্ডস",
          "এআই প্রযুক্তির ব্যবহার ও নিজস্ব এআই চ্যাটবট অ্যাপ্লিকেশন নির্মাণ",
          "নিজস্ব অরিজিনাল ক্যাপস্টোন প্রজেক্ট প্রেজেন্টেশন ও সার্টিফিকেট অর্জন",
        ],
        prerequisites: [
          "কোনো পূর্ব কোডিং অভিজ্ঞতার প্রয়োজন নেই — একদম শুরু থেকে শেখানো হবে",
          "ইন্টারনেট কানেকশনসহ একটি সচল ল্যাপটপ বা কম্পিউটার",
          "শেখার আগ্রহ ও কৌতূহল",
        ],
        instructorId: jabed?._id || fallbackInstructor,
        instructorIds: [jabed?._id || fallbackInstructor, tonni?._id || fallbackInstructor].filter(Boolean),
      },
    ];

    // Purge any dummy courses that are NOT in the authentic 2 courses
    const authenticSlugs = coreCourses.map((c) => c.slug);
    const dummyCourses = await Course.find({ slug: { $nin: authenticSlugs } });
    if (dummyCourses.length > 0) {
      const dummyCourseIds = dummyCourses.map((d) => d._id);
      const { Batch } = await import("../modules/batch/model/batch.model.js");
      await Batch.deleteMany({ courseId: { $in: dummyCourseIds } });
      await Course.deleteMany({ _id: { $in: dummyCourseIds } });
      console.log(`[Course Metadata] Purged ${dummyCourses.length} dummy courses and associated batches.`);
    }

    for (const c of coreCourses) {
      let existing = await Course.findOne({ slug: c.slug });
      if (!existing) {
        if (c.slug === "junior-robotics") {
          existing = await Course.findOne({ title: { $regex: /robot/i } });
        } else if (c.slug === "python-programming-for-teens") {
          existing = await Course.findOne({ title: { $regex: /python/i } });
        }
      }

      if (existing) {
        await Course.updateOne(
          { _id: existing._id },
          {
            $set: {
              ...c,
            },
          }
        );
      } else {
        await Course.create(c);
        console.log(`[Course Metadata] Created platform course: ${c.title}`);
      }
    }

    // Ensure all existing authentic courses have isPublished and isAdminApproved set to true
    await Course.updateMany(
      {},
      {
        $set: {
          isPublished: true,
          isAdminApproved: true,
          isRegistrationOpen: true,
          type: "live",
          language: "Bangla & English",
        },
      }
    );

    // Remove dummy instructor accounts if any re-appeared
    await User.deleteMany({
      email: {
        $in: [
          "tanvir.robotics@learngrow.com",
          "sumaiya.python@learngrow.com",
          "mahmudul.coder@learngrow.com",
          "nafis.game@learngrow.com",
          "farhana.stem@learngrow.com",
          "arif.ai@learngrow.com",
          "marko@learngrow.academy",
          "antonia@learngrow.academy",
          "nenad@learngrow.academy",
          "antonella@learngrow.academy",
          "sarah.ahmed@learngrow.academy",
          "ahmed.khan@learngrow.academy",
          "fatima.rahman@learngrow.academy",
          "omar.hassan@learngrow.academy",
          "nadia.islam@learngrow.academy",
          "mdshakil526563@gmail.com",
          "mdshakil26563@gmail.com",
          "jabed@learngrow.academy",
          "test@gmail.com",
          "test1@gmail.com",
          "admin@admin.com",
          "demo@learngrow.com",
          "instructor@learngrow.com",
        ],
      },
    });

    console.log("[Course Metadata] All authentic platform courses verified with published status and authentic mentors.");
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
<div class="space-y-8 text-slate-700 leading-relaxed">
  <div class="pb-4 border-b border-slate-100">
    <p class="text-xs uppercase tracking-wider font-semibold text-slate-400">Learn & Grow Platform • Official Legal Policy</p>
    <p class="text-xs text-slate-500 mt-1">Last Updated & Effective: October 18, 2026 | সর্বশেষ হালনাগাদ: ১৮ অক্টোবর ২০২৬</p>
  </div>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">1</span>
      <span>ভূমিকা ও তথ্যের সুরক্ষা (Scope & Overview)</span>
    </h2>
    <p>
      Learn & Grow (ওয়েবসাইট: <a href="https://learnandgrow.io" class="text-blue-600 font-semibold underline underline-offset-2">https://learnandgrow.io</a>) শিশু, কিশোর এবং তরুণ শিক্ষার্থীদের জন্য উদ্ভাবনী স্টেম (STEM), কোডিং ও রোবটিক্স শিক্ষা প্রদানকারী একটি নির্ভরযোগ্য প্ল্যাটফর্ম। আমরা শিক্ষার্থী এবং তাদের অভিভাবকদের ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা, সুরক্ষা ও আন্তর্জাতিক মানদণ্ড বজায় রাখতে দায়বদ্ধ। এই প্রাইভেসী পলিসিতে স্পষ্টভাবে উল্লেখ করা হয়েছে আমরা কী ধরনের তথ্য সংগ্রহ করি, কীভাবে তা প্রক্রিয়াজাত করি এবং কীভাবে তা সুরক্ষিত রাখি।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">2</span>
      <span>আমরা যেসব তথ্য সংগ্রহ করি (Information We Collect)</span>
    </h2>
    <p>প্ল্যাটফর্মে উন্নত শিক্ষা ও ল্যাব সেবা নিশ্চিত করার জন্য আমরা কেবল প্রয়োজনীয় তথ্য সংগ্রহ করি:</p>
    <ul class="list-disc pl-5 space-y-2 text-sm sm:text-base">
      <li><strong>অভিভাবক ও শিক্ষার্থীর প্রোফাইল:</strong> শিক্ষার্থীর পূর্ণ নাম, বয়স, অধ্যয়নরত শ্রেণি বা বিদ্যালয়, এবং অভিভাবকের সক্রিয় যোগাযোগের ইমেইল ও মোবাইল নম্বর।</li>
      <li><strong>শিক্ষাগত অগ্রগতি ও ল্যাব অ্যাক্টিভিটি:</strong> লাইভ ক্লাসে উপস্থিতি, কুইজ স্কোর, কোডিং প্রোজেক্ট সাবমিশন এবং শিক্ষকের মূল্যায়নী মতামত।</li>
      <li><strong>লজিস্টিকস ও কিট ডেলিভারি তথ্য:</strong> রোবটিক্স হার্ডওয়্যার কিট শিক্ষার্থীর ঠিকানায় নিরাপদে পৌঁছে দেওয়ার জন্য পূর্ণাঙ্গ ডেলিভারি ঠিকানা ও ফোন নম্বর।</li>
      <li><strong>পেমেন্ট রেফারেন্স:</strong> ব্যাংক বা মোবাইল ফিনান্সিয়াল সার্ভিসের ট্রানজ্যাকশন আইডি ও পেমেন্ট স্ট্যাটাস। <em>(আমরা কোনো ধরনের ব্যাংক কার্ড পিন, ওটিপি বা পাসওয়ার্ড সংরক্ষণ করি না)</em>।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">3</span>
      <span>শিশু ও কিশোরদের তথ্যের বিশেষ সুরক্ষা (Children's Privacy Protection)</span>
    </h2>
    <p>
      আমাদের অধিকাংশ কোর্স ৬ থেকে ১৮ বছর বয়সী শিক্ষার্থীদের জন্য পরিচালিত। তাই আমরা আন্তর্জাতিক শিশু অনলাইন গোপনীয়তা সুরক্ষা মানদণ্ড (COPPA নীতিমালা) অনুসরণ করি। কোনো শিক্ষার্থীর অ্যাকাউন্ট অভিভাবকের পূর্ণ সম্মতি ব্যতিরেকে সক্রিয় করা হয় না। আমরা কখনোই শিক্ষার্থীদের ব্যক্তিগত ডেটা কোনো তৃতীয় পক্ষের বাণিজ্যিক প্রচারণা, বিজ্ঞাপন বা ডাটাবেজ বিক্রির জন্য ব্যবহার করি না।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">4</span>
      <span>তথ্য ব্যবহারের উদ্দেশ্য (Purpose of Processing)</span>
    </h2>
    <ul class="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
      <li>১০-১৫ জনের নিবিড় মাইক্রো-ব্যাচে লাইভ ক্লাস শিডিউলিং ও মেন্টর সাপোর্ট প্রদান।</li>
      <li>কোর্স সমাপনান্তে ভেরিফায়েবল ডিজিটাল সার্টিফিকেট ইস্যু ও পাবলিক ভেরিফিকেশন।</li>
      <li>শিক্ষার্থীর নিরাপত্তা, অনলাইন সাইবার সুরক্ষা এবং প্ল্যাটফর্মের পারফরম্যান্স বিশ্লেষণ।</li>
      <li>জরুরি অ্যাকাডেমিক নোটিশ, শিডিউল পরিবর্তন এবং অভিভাবক অগ্রগতি প্রতিবেদন প্রেরণ।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">5</span>
      <span>তথ্য সংরক্ষণ ও নিরাপত্তা (Data Security & Retention)</span>
    </h2>
    <p>
      সকল অ্যাকাউন্টের ডেটা আধুনিক এনক্রিপশন (TLS/SSL ও AES-256) প্রযুক্তির মাধ্যমে সুরক্ষিত সার্ভারে সংরক্ষিত থাকে। নিয়মিত সিকিউরিটি অডিট ও কঠোর অ্যাক্সেস নিয়ন্ত্রণের মাধ্যমে ডেটা সুরক্ষার সর্বোচ্চ নিশ্চয়তা দেওয়া হয়।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">6</span>
      <span>অভিভাবকের অধিকার (Parental Rights & Data Deletion)</span>
    </h2>
    <p>
      যেকোনো সময় অভিভাবক তাদের সন্তানের সংরক্ষিত তথ্য পর্যালোচনা, সংশোধন বা সম্পূর্ণ অ্যাকাউন্ট স্থায়ীভাবে মুছে ফেলার লিখিত আবেদন করতে পারেন। আমাদের প্রাইভেসী ডেস্ক সর্বোচ্চ ৩ কার্যদিবসের মধ্যে এই অনুরোধ কার্যকর করে থাকে।
    </p>
  </section>

  <section class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
    <h3 class="text-base font-bold text-slate-900">৭. প্রাইভেসী ডেস্ক ও অফিসিয়াল যোগাযোগ (Privacy Office Contacts)</h3>
    <p class="text-xs sm:text-sm text-slate-600">
      প্রাইভেসী সম্পর্কিত যেকোনো জিজ্ঞাসা বা ডেটা অপসারণের অনুরোধের জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন:
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Privacy Inquiries</span>
        <a href="mailto:privacy@learnandgrow.io" class="font-bold text-blue-600 hover:underline">privacy@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Data Protection Officer (DPO)</span>
        <a href="mailto:dpo@learnandgrow.io" class="font-bold text-blue-600 hover:underline">dpo@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Student & Parent Support</span>
        <a href="mailto:support@learnandgrow.io" class="font-bold text-blue-600 hover:underline">support@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">WhatsApp & Helpline</span>
        <a href="https://wa.me/8801706276447" target="_blank" class="font-bold text-slate-800 hover:underline">+880 1706-276447</a>
        <span class="text-[10px] text-slate-400 block mt-0.5">10 AM - 6 PM, Sat-Thu (BST)</span>
      </div>
    </div>
  </section>
</div>
        `.trim(),
      },
      {
        page: "terms-of-use",
        defaultHtml: `
<div class="space-y-8 text-slate-700 leading-relaxed">
  <div class="pb-4 border-b border-slate-100">
    <p class="text-xs uppercase tracking-wider font-semibold text-slate-400">Learn & Grow Platform • Terms of Service</p>
    <p class="text-xs text-slate-500 mt-1">Effective Date: October 18, 2026 | কার্যকারী তারিখ: ১৮ অক্টোবর ২০২৬</p>
  </div>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">1</span>
      <span>শর্তাবলী গ্রহণ (Acceptance of Terms)</span>
    </h2>
    <p>
      Learn & Grow (ওয়েবসাইট: <a href="https://learnandgrow.io" class="text-blue-600 font-semibold underline underline-offset-2">https://learnandgrow.io</a>) এবং এর সকল সেবা, কোর্স ও ডিজিটাল ল্যাব ব্যবহার করার মাধ্যমে আপনি এবং আপনার অভিভাবক এই শর্তাবলী সম্পূর্ণভাবে পাঠ করে তা মানতে সম্মতি প্রদান করছেন। এই নীতিমালা প্ল্যাটফর্মের প্রতিটি কোর্স, ইভেন্ট, ডিজিটাল কনটেন্ট ও ফিজিক্যাল কিট বিতরণের ক্ষেত্রে সমভাবে প্রযোজ্য।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">2</span>
      <span>অ্যাকাউন্ট ও অভিভাবকীয় দায়িত্ব (Account & Supervision)</span>
    </h2>
    <ul class="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
      <li>সকল নাবালক শিক্ষার্থীর পক্ষে তাদের আইনগত অভিভাবক অ্যাকাউন্ট নিবন্ধন ও ফি পরিশোধ সম্পন্ন করবেন।</li>
      <li>লগইন ক্রেডেনশিয়াল (পাসওয়ার্ড ও ইমেইল) গোপন রাখা ব্যবহারকারীর দায়িত্ব। কোনো অননুমোদিত ব্যবহারের ক্ষেত্রে অবিলম্বে সাপোর্ট টিমকে অবগত করতে হবে।</li>
      <li>একক শিক্ষার্থী অ্যাকাউন্টের অ্যাক্সেস একাধিক পরিবারের মধ্যে ভাগাভাগি করা সম্পূর্ণ নিষিদ্ধ।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">3</span>
      <span>ইন্টারঅ্যাক্টিভ লাইভ ক্লাসরুম আচরণবিধি (Classroom Code of Conduct)</span>
    </h2>
    <p>
      আমাদের লাইভ ক্লাসগুলো ১০-১৫ জন শিক্ষার্থীর সমন্বয়ে পরিচালিত হয়। একটি ইতিবাচক ও নিরাপদ শিক্ষার পরিবেশ বজায় রাখতে নিম্নলিখিত নিয়ম বাধ্যতামূলক:
    </p>
    <ul class="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
      <li>শিক্ষক ও সহপাঠীদের প্রতি শালীন ও উৎসাহব্যঞ্জক আচরণ প্রদর্শন করতে হবে। কোনো প্রকার সাইবার বুলিং বা কটূক্তি কঠোরভাবে নিষিদ্ধ।</li>
      <li>লাইভ ক্লাসের ভিডিও লিংক, জুম/গুগল মিট রুম আইডি বা পাসওয়ার্ড তৃতীয় কারো সাথে শেয়ার করা যাবে না।</li>
      <li>অনুমতি ব্যতীত ক্লাসরুমের ভিডিও বা সহপাঠীদের ছবি রেকর্ড করে সোশ্যাল মিডিয়ায় প্রচার করা আইনত ও প্রাতিষ্ঠানিকভাবে দণ্ডনীয়।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">4</span>
      <span>মেধাস্বত্ব ও ব্যক্তিগত ব্যবহার (Intellectual Property)</span>
    </h2>
    <p>
      Learn & Grow-এর সকল কারিকুলাম, লেকচার শিট, কোডিং প্রজেক্ট, আর্দুইনো সার্কিট ডায়াগ্রাম ও ভিডিও ম্যাটেরিয়াল প্ল্যাটফর্মের নিজস্ব মেধাস্বত্ব। এগুলো কেবল শিক্ষার্থীর ব্যক্তিগত অ-বাণিজ্যিক শিক্ষার জন্য সংরক্ষিত। কোনো প্রকার পুনঃবিক্রয়, বাণিজ্যিক প্রকাশ বা অননুমোদিত প্ল্যাটফর্মে আপলোড করা আইন পরিপন্থী।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">5</span>
      <span>রোবটিক্স ও হার্ডওয়্যার কিট নীতিমালা (STEM Hardware Kits)</span>
    </h2>
    <p>
      রোবটিক্স ও আইওটি কোর্সের জন্য সরবরাহকৃত হার্ডওয়্যার কিট শিক্ষার্থীদের ঠিকানায় যাচাইকৃত কুরিয়ার সার্ভিসের মাধ্যমে পাঠানো হয়। কিট গ্রহণের পর কোনো যন্ত্রাংশে ত্রুটি পরিলক্ষিত হলে শিক্ষার্থীকে ৭ দিনের মধ্যে কাস্টমার সার্ভিসে জানাতে হবে। অভিভাবকের তত্ত্বাবধানে যন্ত্রাংশ ও ইলেকট্রনিক সার্কিট পরিচালনার পরামর্শ দেওয়া হয়।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">6</span>
      <span>আইনি এখতিয়ার (Governing Law & Jurisdiction)</span>
    </h2>
    <p>
      এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন ও আইসিটি অ্যাক্ট অনুসারে পরিচালিত ও নিয়ন্ত্রিত হবে। যেকোনো অমীমাংসিত আইনি বিরোধের ক্ষেত্রে ঢাকার আদালতের এখতিয়ার চূড়ান্ত বলে বিবেচিত হবে।
    </p>
  </section>

  <section class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
    <h3 class="text-base font-bold text-slate-900">৭. প্রাতিষ্ঠানিক ও আইনি যোগাযোগ (Legal Department Contacts)</h3>
    <p class="text-xs sm:text-sm text-slate-600">
      শর্তাবলী বা আইনি নোটিশ সংক্রান্ত যেকোনো তথ্যের জন্য সরাসরি যোগাযোগ করুন:
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Legal Affairs</span>
        <a href="mailto:legal@learnandgrow.io" class="font-bold text-blue-600 hover:underline">legal@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">General Information</span>
        <a href="mailto:info@learnandgrow.io" class="font-bold text-blue-600 hover:underline">info@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Academic Support</span>
        <a href="mailto:support@learnandgrow.io" class="font-bold text-blue-600 hover:underline">support@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Helpline & WhatsApp</span>
        <a href="https://wa.me/8801706276447" target="_blank" class="font-bold text-slate-800 hover:underline">+880 1706-276447</a>
        <span class="text-[10px] text-slate-400 block mt-0.5">10 AM - 6 PM, Sat-Thu (BST)</span>
      </div>
    </div>
  </section>
</div>
        `.trim(),
      },
      {
        page: "refund-policy",
        defaultHtml: `
<div class="space-y-8 text-slate-700 leading-relaxed">
  <div class="pb-4 border-b border-slate-100">
    <p class="text-xs uppercase tracking-wider font-semibold text-slate-400">Learn & Grow Platform • Refund & Cancellation Policy</p>
    <p class="text-xs text-slate-500 mt-1">Effective Date: October 18, 2026 | সংস্করণ তারিখ: ১৮ অক্টোবর ২০২৬</p>
  </div>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">1</span>
      <span>আমাদের প্রতিশ্রুতি ও ১০০% মানি-ব্যাক গ্যারান্টি (100% Satisfaction Guarantee)</span>
    </h2>
    <p>
      Learn & Grow প্ল্যাটফর্মে আমাদের সকল কোর্স আন্তর্জাতিক মানের প্র্যাকটিক্যাল ল্যাব ও শীর্ষ মেন্টরদের সরাসরি তত্ত্বাবধানে পরিচালিত হয়। আমরা শিক্ষার গুণগত মানে শতভাগ আস্থাশীল। যেকোনো শিক্ষার্থী বা অভিভাবক যদি কোর্সের <strong>প্রথম ২টি লাইভ ক্লাসের</strong> পর সন্তুষ্ট না হন, তবে কোনো শর্ত বা কর্তন ছাড়াই ১০০% অর্থ ফেরতের (Full Refund) নিশ্চয়তা পাবেন।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">2</span>
      <span>রিফান্ডের যোগ্যতা ও সময়সীমা (Eligibility & Window)</span>
    </h2>
    <ul class="list-disc pl-5 space-y-2 text-sm sm:text-base">
      <li><strong>লাইভ অনলাইন কোর্স:</strong> সংশ্লিষ্ট ব্যাচের ১ম অথবা ২য় ক্লাস সম্পন্ন হওয়ার পর এবং ৩য় ক্লাস শুরুর পূর্বেই রিফান্ড আবেদন জমা দিতে হবে।</li>
      <li><strong>রোবটিক্স ও ফিজিক্যাল কিট:</strong> ডেলিভারিকৃত হার্ডওয়্যার কিটটির যন্ত্রাংশ অক্ষত এবং ব্যবহারহীন অবস্থায় মূল প্যাকেজে ফেরত দিতে হবে। কিট অক্ষত থাকলে কিটের মূল্যের পূর্ণ অর্থ রিফান্ড করা হবে।</li>
      <li><strong>আবেদনের সময়সীমা:</strong> ব্যাচ শুরুর তারিখ থেকে সর্বোচ্চ ১৪ ক্যালেন্ডার দিনের মধ্যে লিখিত রিফান্ড আবেদন সম্পন্ন করতে হবে।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">3</span>
      <span>বিনামূল্যে ব্যাচ শিফট সুবিধা (Alternative Free Batch Transfer)</span>
    </h2>
    <p>
      যদি শিক্ষার্থীর স্কুল পরীক্ষা, শারীরিক অসুস্থতা বা পারিবারিক কারণে নির্দিষ্ট ব্যাচে ক্লাস চালিয়ে নেওয়া সম্ভব না হয়, তবে শিক্ষার্থীকে ফি ফেরত ছাড়াই পরবর্তী যেকোনো সুবিধাজনক ব্যাচে সম্পূর্ণ বিনামূল্যে স্থানান্তর (Batch Shift) করে দেওয়া হয়। এতে শিক্ষার্থীর মূল্যবান কোর্স ফি বা শিক্ষার ধারাবাহিকতা ক্ষতিগ্রস্ত হয় না।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">4</span>
      <span>যেসব ক্ষেত্রে রিফান্ড প্রযোজ্য নয় (Non-Refundable Cases)</span>
    </h2>
    <ul class="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
      <li>কোর্সের ৩য় লাইভ ক্লাস শুরু বা সম্পন্ন হওয়ার পর কোনো অর্থ ফেরতযোগ্য হবে না।</li>
      <li>অননুমোদিত বা পূর্বে নোটিশ ব্যতিরেকে ক্লাসে অনুপস্থিত থাকলে তা রিফান্ডের কারণ হিসেবে গণ্য হবে না।</li>
      <li>হার্ডওয়্যার কিট ইচ্ছাকৃতভাবে ভাঙা বা পোড়ানো হলে কিটের অংশের মূল্য ফেরতযোগ্য হবে না।</li>
    </ul>
  </section>

  <section class="space-y-3">
    <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
      <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center justify-center">5</span>
      <span>রিফান্ড প্রসেসিং ও পরিশোধের সময়সীমা (Processing & Payout)</span>
    </h2>
    <p>
      রিফান্ড আবেদন অনুমোদিত হওয়ার পর <strong>৫ থেকে ৭ কার্যদিবসের (Business Days)</strong> মধ্যে শিক্ষার্থীর মূল পেমেন্ট মাধ্যমে (বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্ট) কোনো প্রকার হিডেন চার্জ ছাড়াই সরাসরি টাকা পৌঁছে দেওয়া হয়।
    </p>
  </section>

  <section class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
    <h3 class="text-base font-bold text-slate-900">৬. রিফান্ড ও বিলিং যোগাযোগ (Refund Desk Contacts)</h3>
    <p class="text-xs sm:text-sm text-slate-600">
      রিফান্ডের আবেদন বা বিলিং সম্পর্কিত যেকোনো সহযোগিতার জন্য আপনার অর্ডার আইডি ও শিক্ষার্থী বিবরণসহ যোগাযোগ করুন:
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Refund Department</span>
        <a href="mailto:refund@learnandgrow.io" class="font-bold text-blue-600 hover:underline">refund@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Billing Support</span>
        <a href="mailto:billing@learnandgrow.io" class="font-bold text-blue-600 hover:underline">billing@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Student Care</span>
        <a href="mailto:support@learnandgrow.io" class="font-bold text-blue-600 hover:underline">support@learnandgrow.io</a>
      </div>
      <div class="p-3 rounded-xl bg-white border border-slate-200">
        <span class="text-slate-400 block text-[11px] uppercase font-semibold">Official Helpline</span>
        <a href="https://wa.me/8801706276447" target="_blank" class="font-bold text-slate-800 hover:underline">+880 1706-276447</a>
        <span class="text-[10px] text-slate-400 block mt-0.5">10 AM - 6 PM, Sat-Thu (BST)</span>
      </div>
    </div>
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
    <h2 class="text-xl font-bold text-gray-900">১. কুকি কী এবং কেন ব্যবহার করা হয়? (What Are Cookies)</h2>
    <p class="text-gray-700 leading-relaxed">
      কুকি হলো ছোট টেক্সট ফাইল যা আপনার ব্রাউজারে সংরক্ষিত হয় যাতে প্ল্যাটফর্মে আপনার লগইন সেশন, ভাষা পছন্দ (বাংলা/ইংরেজি), এবং ড্যাশবোর্ড সেটিংস অক্ষুণ্ণ থাকে।
    </p>
  </section>

  <section class="space-y-3">
    <h2 class="text-xl font-bold text-gray-900">২. আমরা যেসব কুকি ব্যবহার করি</h2>
    <ul class="list-disc pl-5 space-y-1.5 text-gray-700">
      <li><strong>প্রয়োজনীয় কুকি:</strong> নিরাপদ লগইন ও অথেন্টিকেশন টোকেন পরিচালনার জন্য।</li>
      <li><strong>ফাংশনাল কুকি:</strong> আপনার নির্বাচিত ভাষা ও থিম অগ্রাধিকার মনে রাখার জন্য।</li>
      <li><strong>পারফরম্যান্স কুকি:</strong> সাইটের স্পিড ও নেভিগেশন উন্নত করার জন্য সামগ্রিক ভিজিটর পরিসংখ্যান।</li>
    </ul>
  </section>

  <section class="space-y-3 bg-amber-50/60 p-6 rounded-2xl border border-amber-100">
    <h2 class="text-lg font-bold text-amber-900">৩. কুকি নিয়ন্ত্রণ ও সহায়তা (Managing Cookies)</h2>
    <p class="text-sm text-amber-800 leading-relaxed mb-3">
      আপনি আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকি ডিলিট বা ব্লক করতে পারেন। এ সংক্রান্ত তথ্যের জন্য যোগাযোগ করুন:
    </p>
    <ul class="text-sm text-amber-900 space-y-1 font-medium">
      <li>• <strong>কুকি ও প্রাইভেসি ডেস্ক:</strong> <a href="mailto:privacy@learnandgrow.io" class="underline font-bold text-amber-700">privacy@learnandgrow.io</a></li>
      <li>• <strong>সাধারণ সহায়তা:</strong> <a href="mailto:support@learnandgrow.io" class="underline font-bold text-amber-700">support@learnandgrow.io</a></li>
      <li>• <strong>হোয়াটসঅ্যাপ সাপোর্ট:</strong> <a href="https://wa.me/8801706276447" target="_blank" class="underline font-bold text-amber-700">+880 1706-276447</a> (সকাল ১০টা - সন্ধ্যা ৬টা, শনি-বৃহস্পতি / Business hours: 10 AM - 6 PM, Sat-Thu)</li>
    </ul>
  </section>
</div>
        `.trim(),
      },
    ];

    for (const p of policies) {
      const existing = await SiteContent.findOne({ page: p.page });
      if (!existing || !existing.content || (typeof existing.content === "string" && (existing.content.trim() === "" || existing.content.length < 500 || !existing.content.includes("Official Legal Policy")))) {
        await SiteContent.findOneAndUpdate(
          { page: p.page },
          { $set: { content: p.defaultHtml } },
          { upsert: true, new: true }
        );
        console.log(`[Site Content Seeder] Seeded minimal professional policy for ${p.page} with @learnandgrow.io emails & WhatsApp.`);
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

    await ensureAllTutors();
    await ensureCourseMetadata();
    await ensureEvents();
    await ensureSitePolicies();

    // Fix phone conflict: +393463275710 belongs to CEO/Founder Md Jabed Hosen (m.riyad3834@gmail.com)
    await User.updateOne(
      { email: "tasnimtonni024@gmail.com", phone: { $regex: /3463275710/ } },
      { $set: { phone: "+8801700000024" } }
    );

    try {
      const { ensureAllCourseBatches } = await import("../modules/batch/service/batch.service.js");
      await ensureAllCourseBatches();
    } catch (batchSyncErr) {
      console.error("[Batch Seeder] Failed to sync batches:", batchSyncErr);
    }
  } catch (error) {
    console.error("[Admin Seeder] Failed to ensure admin users:", error);
  }
};

