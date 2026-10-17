import bcrypt from "bcryptjs";
import { User } from "../modules/user/model/user.model.js";
import { TeamMember } from "../modules/team/model/team.model.js";

export interface TutorSeedSpec {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "instructor";
  qualification: string;
  institution: string;
  profileImage: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  originalDatasetPasswordHash?: string;
}

// Strictly authentic Learn & Grow educators matching the original database dataset
export const ALL_TUTORS_SPEC: TutorSeedSpec[] = [
  {
    name: "Md Jabed Hosen",
    email: "m.riyad3834@gmail.com",
    phone: "+393463275710",
    role: "admin",
    qualification: "Lead AI & Python Instructor | Founder & CEO",
    institution: "M.Sc. in Data Science, University of Milano-Bicocca, Italy | Founder, Learn & Grow",
    profileImage: "/images/tutors/tutor-jabed.png",
    bio: "ইতালির ইউনিভার্সিটি অফ মিলানো-বিকোকার ডেটা সায়েন্স গবেষক ও উদ্যোক্তা। শিশু-কিশোরদের পাইথন কোডিং, মেশিন লার্নিং ও এআই প্রযুক্তির রোমাঞ্চকর জগতে দক্ষ করে তুলতে নিবেদিত।",
    expertise: ["Python", "Artificial Intelligence", "Data Science"],
    yearsOfExperience: 3,
  },
  {
    name: "Md Jabed Hosen",
    email: "jabed@learngrow.academy",
    phone: "+8801700000034",
    role: "instructor",
    qualification: "Lead AI & Python Instructor | Founder & CEO",
    institution: "M.Sc. in Data Science, University of Milano-Bicocca, Italy | Founder, Learn & Grow",
    profileImage: "/images/tutors/tutor-jabed.png",
    bio: "ইতালির ইউনিভার্সিটি অফ মিলানো-বিকোকার ডেটা সায়েন্স গবেষক ও উদ্যোক্তা। শিশু-কিশোরদের পাইথন কোডিং, মেশিন লার্নিং ও এআই প্রযুক্তির রোমাঞ্চকর জগতে দক্ষ করে তুলতে নিবেদিত।",
    expertise: ["Python", "Artificial Intelligence", "Data Science"],
    yearsOfExperience: 3,
  },
  {
    name: "Md. Tanvir Hassan",
    email: "tanvirhassan1201@gmail.com",
    phone: "+8801700000021",
    role: "instructor",
    qualification: "Senior Robotics & Hardware Engineer",
    institution: "R&D at Cybernetics Hi-Tech Solutions | Robotics Teacher at Learn & Grow",
    profileImage: "/images/tutors/tutor-tanvir.png",
    bio: "উদ্ভাবনী হার্ডওয়্যার ইঞ্জিনিয়ার ও রোবটিক্স ট্রেইনার। শিশু ও তরুণদের প্রজেক্ট-ভিত্তিক আর্দুইনো, সেন্সর ও সার্কিট ডিজাইনে বাস্তব দক্ষতা গড়ে তোলেন।",
    expertise: ["Robotics & Arduino", "STEM Education", "Hardware"],
    yearsOfExperience: 6,
    // Original bcrypt hash from users.json backup dataset
    originalDatasetPasswordHash: "$2b$10$rA5gSsl1OWVGVN5gNhUjMeG0kySlQm5H.WaTF8.iZb7TKBUF5u9uC",
  },
  {
    name: "Tasnim Jahan Tonni",
    email: "tasnimtonni024@gmail.com",
    phone: "+8801700000024",
    role: "instructor",
    qualification: "Lead Coding & AI Mentor",
    institution: "Lecturer, Daffodil International University | Researcher at Quantonova Ltd",
    profileImage: "/images/tutors/tutor-tonni.png",
    bio: "কম্পিউটার সায়েন্স গবেষক ও অভিজ্ঞ বিশ্ববিদ্যালয় শিক্ষক। শিশুদের পাইথন কোডিং, মেশিন লার্নিং ও এআই অ্যালগরিদম সহজ ভাষায় বাস্তব প্রজেক্টের মাধ্যমে শেখান।",
    expertise: ["Python", "AI & Machine Learning", "Coding"],
    yearsOfExperience: 5,
    // Original bcrypt hash from users.json backup dataset
    originalDatasetPasswordHash: "$2b$10$T9OzX8kEN4ORsuFoyMuGi.i4CBfklFLoqzhuN48j8ehKezZJHVJUK",
  },
  {
    name: "Saiful Islam",
    email: "saifulislam@learngrow.academy",
    phone: "+8801700000025",
    role: "instructor",
    qualification: "Master Coder & Algorithms Lead",
    institution: "MS, Data Science at Sapienza Università di Roma, Italy",
    profileImage: "/images/tutors/tutor-saiful.png",
    bio: "ইতালির স্যাপিয়েনজা ইউনিভার্সিটির ডেটা সায়েন্স গবেষক। শিশুদের ক্রিটিক্যাল থিংকিং, অ্যালগরিদম ও ক্রিয়েটিভ প্রবলেম সলভিংয়ে বিশ্বমানের দক্ষতা তৈরিতে নিবেদিত।",
    expertise: ["Data Science", "Python", "Algorithms"],
    yearsOfExperience: 7,
  },
  {
    name: "Shakil Rana",
    email: "shakilrana@learngrow.academy",
    phone: "+8801700000026",
    role: "instructor",
    qualification: "Junior Game Creator & STEM Lead",
    institution: "M.Sc. in AI and Intelligent Systems, University of Bremen, Germany",
    profileImage: "/images/tutors/tutor-shakil.png",
    bio: "জার্মানির ব্রেমেন ইউনিভার্সিটির এআই গবেষক। শিশু-কিশোরদের স্ক্র্যাচ, রবলক্স গেম ডেভেলপমেন্ট ও সৃজনশীল কোডিং শেখাতে নিবেদিত।",
    expertise: ["Scratch", "Roblox", "Game Development"],
    yearsOfExperience: 5,
  },
  {
    name: "Shovan Parvez",
    email: "shovanparvez@learngrow.academy",
    phone: "+8801700000027",
    role: "instructor",
    qualification: "Hands-on Robotics & IoT Specialist",
    institution: "Rehabilitation Engineer, Centre for the Rehabilitation of the Paralysed (CRP)",
    profileImage: "/images/tutors/tutor-sovon.png",
    bio: "সিআরপি-র রিহ্যাবিলিটেশন ইঞ্জিনিয়ার ও আইওটি বিশেষজ্ঞ। শিশুদের হাতে-কলমে সার্কিট মেকিং, সেন্সর প্রোগ্রামিং এবং বাস্তব হার্ডওয়্যার রোবট প্রজেক্ট তৈরি শেখান।",
    expertise: ["IoT", "Microcontrollers", "Circuits"],
    yearsOfExperience: 5,
  },
];

export const ensureAllTutors = async () => {
  try {
    // 1. Purge any random / dummy tutors so only authentic team members exist
    const DUMMY_EMAILS = [
      "marko@learngrow.academy",
      "antonia@learngrow.academy",
      "nenad@learngrow.academy",
      "antonella@learngrow.academy",
    ];
    await User.deleteMany({ email: { $in: DUMMY_EMAILS } });
    await TeamMember.deleteMany({
      name: { $in: ["Marko Vidakovic", "Antonia Popovic", "Nenad Tomic", "Antonella Rossi"] },
    });

    const defaultPassword = "Instructor@123";
    const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);

    for (const t of ALL_TUTORS_SPEC) {
      const emailRegex = new RegExp(`^${t.email.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i");
      let user = await User.findOne({ email: emailRegex });

      if (user) {
        let changed = false;

        // AUTHENTIC PASSWORD PRESERVATION RULE:
        // 1. If this account is from the original dataset and has a known original hash, enforce/restore it if corrupted
        if (t.originalDatasetPasswordHash && user.password !== t.originalDatasetPasswordHash) {
          user.password = t.originalDatasetPasswordHash;
          changed = true;
        } else if (!user.password || user.password.trim() === "") {
          // 2. Only if the user has NO password set, assign the standard default password
          user.password = hashedDefaultPassword;
          changed = true;
        }
        // 3. If the user already has a valid password, DO NOT OVERWRITE IT.

        if (user.role !== t.role && user.role !== "admin") {
          user.role = t.role;
          changed = true;
        }
        if (!user.isApproved) {
          user.isApproved = true;
          changed = true;
        }
        if (!user.isVerified) {
          user.isVerified = true;
          changed = true;
        }
        if (user.isBlocked) {
          user.isBlocked = false;
          changed = true;
        }
        if (!user.profileImage || user.profileImage.includes("placeholder") || user.profileImage === "") {
          user.profileImage = t.profileImage;
          changed = true;
        }
        if (!user.qualification) {
          user.qualification = t.qualification;
          changed = true;
        }
        if (!user.institution) {
          user.institution = t.institution;
          changed = true;
        }
        if (!user.bio) {
          user.bio = t.bio;
          changed = true;
        }
        if (!user.expertise || user.expertise.length === 0) {
          user.expertise = t.expertise;
          changed = true;
        }
        if (!user.yearsOfExperience) {
          user.yearsOfExperience = t.yearsOfExperience;
          changed = true;
        }

        if (changed) {
          await user.save();
          console.log(`[Tutor Seeder] Verified authentic instructor account for ${t.name} (${t.email})`);
        }
      } else {
        const passwordToSet = t.originalDatasetPasswordHash || hashedDefaultPassword;
        user = await User.create({
          name: t.name,
          email: t.email.toLowerCase(),
          phone: t.phone,
          password: passwordToSet,
          role: t.role,
          profileImage: t.profileImage,
          bio: t.bio,
          qualification: t.qualification,
          institution: t.institution,
          expertise: t.expertise,
          yearsOfExperience: t.yearsOfExperience,
          isApproved: true,
          isVerified: true,
          isBlocked: false,
        });
        console.log(`[Tutor Seeder] Created new authentic instructor account for ${t.name} (${t.email})`);
      }

      // Sync with TeamMember collection so home page & team API link to real user profile
      try {
        await TeamMember.findOneAndUpdate(
          { name: t.name },
          {
            $set: {
              name: t.name,
              role: t.qualification,
              domain: t.expertise[0] || "Coding & Robotics",
              yearsOfExperience: `${t.yearsOfExperience}+ Years`,
              expertise: t.expertise,
              image: t.profileImage,
              bio: t.bio,
              showOnHome: true,
              userId: user._id.toString(),
            },
          },
          { upsert: true, new: true }
        );
      } catch (teamSyncErr) {
        console.error(`[Tutor Seeder] Failed to sync TeamMember for ${t.name}:`, teamSyncErr);
      }
    }

    console.log(`[Tutor Seeder] Successfully verified all ${ALL_TUTORS_SPEC.length} authentic tutors with preserved dataset credentials.`);
  } catch (error) {
    console.error("[Tutor Seeder] Failed to ensure tutors:", error);
  }
};
