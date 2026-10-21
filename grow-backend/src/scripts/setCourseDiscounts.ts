/**
 * One-off migration: set the 40% OFF discount on the two flagship courses.
 *
 * Semantics (see src/utils/pricing.ts):
 *   - `price`         = the ORIGINAL / list price (unchanged by this script)
 *   - `discountPrice` = the price AFTER the discount
 *
 * The script is IDEMPOTENT and SAFE:
 *   - it only touches courses whose `price` matches the expected list price
 *   - it never overwrites an existing, valid `discountPrice`
 *   - it prints a dry-run summary before writing
 *
 * Run with:  npx tsx src/scripts/setCourseDiscounts.ts [--apply] [--force]
 *
 *   --apply  write the changes to the database
 *   --force  overwrite an existing valid discount (e.g. to change 17% -> 40%)
 */
import mongoose from "mongoose";
import { config } from "../config/index.js";
import { getCoursePricing } from "../utils/pricing.js";

type CourseDoc = {
  _id: mongoose.Types.ObjectId;
  title: string;
  price: number;
  discountPrice?: number | null;
  slug?: string;
};

/** The two flagship courses and the list price each is expected to have. */
const TARGETS: Array<{
  match: { _id?: string; titleContains?: string; slugContains?: string };
  expectedPrice: number;
  discountPercent: number;
}> = [
  {
    match: { _id: "69ce553ce9e96ed805295101", titleContains: "python" },
    expectedPrice: 2999,
    discountPercent: 40,
  },
  {
    match: { _id: "69ca5603e9e96ed80529474a", titleContains: "robot" },
    expectedPrice: 3499,
    discountPercent: 40,
  },
];

const APPLY = process.argv.includes("--apply");
const FORCE = process.argv.includes("--force");

async function run() {
  console.log(APPLY ? "APPLYING changes..." : "DRY RUN (use --apply to write)");
  await mongoose.connect(config.MONGODB_URI);
  const db = mongoose.connection.db;
  if (!db) throw new Error("No database connected");

  const courses = (await db
    .collection("courses")
    .find({})
    .toArray()) as unknown as CourseDoc[];

  const updates: Array<{
    _id: mongoose.Types.ObjectId;
    title: string;
    price: number;
    discountPrice: number;
  }> = [];

  for (const target of TARGETS) {
    const course = courses.find((c) => {
      if (target.match._id && c._id.toString() === target.match._id) return true;
      const title = (c.title || "").toLowerCase();
      if (target.match.titleContains && title.includes(target.match.titleContains)) return true;
      const slug = (c.slug || "").toLowerCase();
      if (target.match.slugContains && slug.includes(target.match.slugContains)) return true;
      return false;
    });

    if (!course) {
      console.log(`  ! No course matched ${JSON.stringify(target.match)} - skipped`);
      continue;
    }

    console.log(
      `\n  Course : ${course.title}\n  ID     : ${course._id}\n  Price  : ${course.price}` +
        `\n  Current discountPrice: ${course.discountPrice ?? "(none)"}`
    );

    if (course.price !== target.expectedPrice) {
      console.log(
        `  ! Price is ${course.price}, expected ${target.expectedPrice} - skipped ` +
          `(set the Discount Price field in the admin panel instead)`
      );
      continue;
    }

    // Never overwrite an existing, valid discount unless --force is given.
    const existing = getCoursePricing(course);
    if (existing.hasDiscount) {
      if (!FORCE) {
        console.log(
          `  = Already has a valid discount (${existing.discountPercent}%, ` +
            `discountPrice ${existing.discountPrice}) - skipped. ` +
            `Use --force to change it.`
        );
        continue;
      }
      console.log(
        `  ~ Overwriting the existing discount (${existing.discountPercent}%, ` +
          `discountPrice ${existing.discountPrice}) because --force was given`
      );
    }

    const discountPrice = Math.round(
      course.price * (1 - target.discountPercent / 100)
    );
    console.log(
      `  -> Setting discountPrice = ${discountPrice} (${target.discountPercent}% off)`
    );
    updates.push({
      _id: course._id,
      title: course.title,
      price: course.price,
      discountPrice,
    });
  }

  if (updates.length === 0) {
    console.log("\nNothing to do.");
  } else if (APPLY) {
    for (const u of updates) {
      await db
        .collection("courses")
        .updateOne({ _id: u._id }, { $set: { discountPrice: u.discountPrice } });
      console.log(`  ✓ ${u.title}: price ${u.price} -> discountPrice ${u.discountPrice}`);
    }
    console.log(`\nUpdated ${updates.length} course(s).`);
  } else {
    console.log(
      `\n${updates.length} course(s) would be updated. Re-run with --apply to write.`
    );
  }

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Migration failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
