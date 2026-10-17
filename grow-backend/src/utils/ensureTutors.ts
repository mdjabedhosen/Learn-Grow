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
}

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
  {
    name: "Marko Vidakovic",
    email: "marko@learngrow.academy",
    phone: "+8801700000028",
    role: "instructor",
    qualification: "Lead Full-Stack & Systems Mentor",
    institution: "Senior Software Engineer & Mentor",
    profileImage: "/images/tutors/tutor-marko.jpg",
    bio: "অভিজ্ঞ ফুল-স্ট্যাক ও ক্লাউড সফটওয়্যার ইঞ্জিনিয়ার। শিশু-কিশোরদের আধুনিক ওয়েব টেকনোলজি ও সফটওয়্যার আর্কিটেকচার শেখাতে নিবেদিত।",
    expertise: ["Full-Stack", "JavaScript", "Cloud Systems"],
    yearsOfExperience: 6,
  },
  {
    name: "Antonia Popovic",
    email: "antonia@learngrow.academy",
    phone: "+8801700000029",
    role: "instructor",
    qualification: "Curriculum Designer & Creative Coding Lead",
    institution: "EdTech Curriculum Specialist",
    profileImage: "/images/tutors/tutor-antonia.jpg",
    bio: "এডটেক কারিকুলাম ডিজাইনার ও কোডিং মেন্টর। শিশুদের জন্য সহজবোধ্য ও আনন্দময় কোডিং লেসন তৈরিতে পারদর্শী।",
    expertise: ["Creative Coding", "Scratch", "Logic Building"],
    yearsOfExperience: 5,
  },
  {
    name: "Nenad Tomic",
    email: "nenad@learngrow.academy",
    phone: "+8801700000030",
    role: "instructor",
    qualification: "AI & Embedded Systems Specialist",
    institution: "Hardware & AI Researcher",
    profileImage: "/images/tutors/tutor-nenad.jpg",
    bio: "এআই ও এমবেডেড সিস্টেমস গবেষক। শিশু ও তরুণদের জন্য মাইক্রোকন্ট্রোলার প্রোগ্রামিং ও ইন্টেলিজেন্ট রোবট তৈরিতে নিবেদিত।",
    expertise: ["Embedded Systems", "Robotics", "AI"],
    yearsOfExperience: 8,
  },
  {
    name: "Antonella Rossi",
    email: "antonella@learngrow.academy",
    phone: "+8801700000031",
    role: "instructor",
    qualification: "Game Design & Interactive Media Mentor",
    institution: "Interactive Media Designer",
    profileImage: "/images/tutors/tutor-antonella.jpg",
    bio: "গেম ডিজাইন ও ইন্টারেক্টিভ মিডিয়া বিশেষজ্ঞ। শিশুদের অ্যানিমেশন, রবলক্স ও স্ক্র্যাচে নিজস্ব গেম বানাতে দক্ষ করে তোলেন।",
    expertise: ["Game Design", "Roblox", "Animation"],
    yearsOfExperience: 5,
  },
];

export const ensureAllTutors = async () => {
  try {
    const defaultPassword = "Instructor@123";
    const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);

    for (const t of ALL_TUTORS_SPEC) {
      const emailRegex = new RegExp(`^${t.email.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`, "i");
      let user = await User.findOne({ email: emailRegex });

      if (user) {
        let changed = false;
        // Ensure user can log in with Instructor@123
        if (!user.password) {
          user.password = hashedDefaultPassword;
          changed = true;
        } else {
          // If password exists, ensure it is set to default Instructor@123 so admin can log in as requested
          user.password = hashedDefaultPassword;
          changed = true;
        }

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
          console.log(`[Tutor Seeder] Verified and updated instructor account for ${t.name} (${t.email})`);
        }
      } else {
        user = await User.create({
          name: t.name,
          email: t.email.toLowerCase(),
          phone: t.phone,
          password: hashedDefaultPassword,
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
        console.log(`[Tutor Seeder] Created new instructor account for ${t.name} (${t.email})`);
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

    console.log(`[Tutor Seeder] Successfully verified all ${ALL_TUTORS_SPEC.length} tutors in User collection with login credentials.`);
  } catch (error) {
    console.error("[Tutor Seeder] Failed to ensure tutors:", error);
  }
};
