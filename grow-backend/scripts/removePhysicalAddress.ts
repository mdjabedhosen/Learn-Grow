/**
 * Removes the physical street address from the stored blog content.
 *
 * The BPSC post was copied from the production database and its article
 * footer still carried the street address:
 *
 *   <h3 ...>Learn & Grow</h3>
 *   <p ...>লেভেল ৪, ৩৫ গ্রিন রোড, ধানমন্ডি, ঢাকা</p>
 *   <a href="https://learnandgrow.io" ...>
 *
 * The street address is dropped; the city and country stay so the page
 * still carries a location signal.
 *
 * Usage: node --import tsx scripts/removePhysicalAddress.ts [--apply]
 */
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";
import { Blog } from "../src/modules/blog/model/blog.model.js";

const APPLY = process.argv.includes("--apply");

// A <p> whose whole text is the street address.
const ADDRESS_LINE =
  /<p[^>]*>\s*(?:<[^>]+>\s*)*[^<]*গ্রিন রোড[^<]*(?:<\/[^>]+>\s*)*<\/p>/gi;

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const blogs = await Blog.find({});
  let changed = 0;

  for (const blog of blogs) {
    const content = blog.content || "";
    if (!content.includes("গ্রিন রোড")) continue;

    const cleaned = content.replace(ADDRESS_LINE, "");
    if (cleaned === content) {
      console.log(`  "${blog.title?.slice(0, 40)}": no matching address element`);
      continue;
    }

    console.log(
      `  "${blog.title?.slice(0, 40)}": address removed from the content`
    );
    if (APPLY) {
      await Blog.updateOne({ _id: blog._id }, { $set: { content: cleaned } });
      changed++;
    }
  }

  // also check the excerpt and any other text field
  const leftovers = await Blog.find({
    $or: [
      { content: { $regex: "গ্রিন রোড" } },
      { excerpt: { $regex: "গ্রিন রোড" } },
    ],
  }).lean();
  console.log(`\n  posts still containing the street address: ${leftovers.length}`);

  console.log(APPLY ? `  APPLIED (${changed} post(s))` : "  DRY RUN - re-run with --apply");
  await mongoose.disconnect();
})();
