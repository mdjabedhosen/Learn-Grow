/**
 * Repairs the two broken relationships left by the database switch:
 *
 * 1. Every module still pointed at the OLD course _id (69ca5603... /
 *    69ce553c...). The courses were re-created with new ids, so the course
 *    page had no modules and showed "No course content available yet."
 *
 * 2. The blog post and its category only ever existed in the production
 *    database - the JSON backup has blogs.json empty. They are fetched from
 *    the production API and written here.
 *
 * Usage: node --import tsx scripts/repairRelations.ts
 */
import mongoose from "mongoose";
import { ENV } from "../src/config/env.js";
import { Blog } from "../src/modules/blog/model/blog.model.js";
import { BlogCategory } from "../src/modules/blog/model/blog-category.model.js";
import { Course } from "../src/modules/course/model/course.model.js";
import { Module } from "../src/modules/course/model/module.model.js";

const PROD = "https://learnandgrow.io/api";

(async () => {
  await mongoose.connect(ENV.MONGODB_URI);
  const db = mongoose.connection.db!;

  // ---------- 1. re-link the modules to the current courses ----------
  const courses = await Course.find({}).lean();
  const bySlug = new Map(courses.map((c: any) => [c.slug, c]));

  // old course id -> new course id
  const courseIdMap = new Map<string, string>();
  const OLD_ROBOTICS = "69ca5603e9e96ed80529474a";
  const OLD_PYTHON = "69ce553ce9e96ed805295101";
  if (bySlug.get("junior-robotics")) {
    courseIdMap.set(OLD_ROBOTICS, (bySlug.get("junior-robotics") as any)._id.toString());
  }
  if (bySlug.get("python-programming-for-teens")) {
    courseIdMap.set(
      OLD_PYTHON,
      (bySlug.get("python-programming-for-teens") as any)._id.toString()
    );
  }
  console.log(
    `  course id map: ${[...courseIdMap.entries()]
      .map(([a, b]) => `${a} -> ${b}`)
      .join(", ")}`
  );

  const modules = await Module.find({}).lean();
  let relinked = 0;
  for (const m of modules as any[]) {
    const mapped = courseIdMap.get(String(m.courseId));
    if (mapped && String(mapped) !== String(m.courseId)) {
      await Module.updateOne({ _id: m._id }, { $set: { courseId: mapped } });
      relinked++;
    }
  }
  console.log(`  re-linked ${relinked} module(s) to the current courses`);

  // ---------- 2. restore the blog post + the categories it uses ----------
  const prodCats: any[] = await (await fetch(`${PROD}/blog/category/list`)).json()
    .then((r: any) => r.data || []);
  const prodBlogs: any[] = await (await fetch(`${PROD}/blog?page=1&limit=50`)).json()
    .then((r: any) => {
      const d = r.data;
      return (d && d.blogs) || d || [];
    });

  console.log(
    `  production has ${prodCats.length} categor(ies), ${prodBlogs.length} post(s)`
  );

  // Only the categories a post actually uses are worth having.
  const usedProdCatIds = new Set<string>();
  for (const pb of prodBlogs) {
    const cid = pb.category?._id || pb.category;
    if (cid) usedProdCatIds.add(String(cid));
  }

  const catIdMap = new Map<string, string>();
  for (const pc of prodCats) {
    if (!usedProdCatIds.has(String(pc._id))) continue;

    const existing = await BlogCategory.findOne({ slug: pc.slug }).lean();
    if (existing) {
      catIdMap.set(String(pc._id), (existing as any)._id.toString());
      continue;
    }
    const created = await BlogCategory.create({
      name: pc.name,
      slug: pc.slug,
      description: pc.description,
    });
    catIdMap.set(String(pc._id), (created as any)._id.toString());
    console.log(`    + category "${pc.name}"`);
  }

  let restoredPosts = 0;
  for (const pb of prodBlogs) {
    const exists = await Blog.findOne({ slug: pb.slug }).lean();
    if (exists) continue;

    // the author must be a real local user
    const author = await db
      .collection("users")
      .findOne({ _id: pb.author });
    let authorId = author?._id;
    if (!authorId) {
      const byEmail = pb.authorEmail
        ? await db.collection("users").findOne({ email: pb.authorEmail })
        : null;
      authorId =
        byEmail?._id ||
        (await db.collection("users").findOne({ role: "admin" }))?._id;
    }
    if (!authorId) {
      console.log(`    ! post "${pb.slug}" skipped - no author available`);
      continue;
    }

    const categoryId = catIdMap.get(String(pb.category?._id || pb.category));

    await Blog.create({
      title: pb.title,
      content: pb.content,
      excerpt: pb.excerpt,
      author: authorId,
      category: categoryId,
      metaTags: pb.metaTags,
      image: pb.image,
      slug: pb.slug,
      isPublished: pb.isPublished !== false,
      isApproved: pb.isApproved !== false,
      readTime: pb.readTime,
      viewCount: pb.viewCount ?? 0,
    });
    restoredPosts++;
    console.log(`    + post "${pb.title}"`);
  }

  console.log(`  restored ${restoredPosts} blog post(s)`);

  // ---------- 3. drop categories no post uses ----------
  const usedLocalCats = new Set(
    (await Blog.find({}).lean()).map((b: any) => String(b.category))
  );
  const allCats = await BlogCategory.find({}).lean();
  for (const c of allCats as any[]) {
    if (!usedLocalCats.has(String(c._id))) {
      await BlogCategory.deleteOne({ _id: c._id });
      console.log(`    - unused category "${c.name}" removed`);
    }
  }

  // ---------- 4. verify ----------
  const finalModules = await Module.find({}).lean();
  const orphanModules = finalModules.filter(
    (m: any) => !courses.some((c: any) => String(c._id) === String(m.courseId))
  );
  console.log(
    `\n  modules: ${finalModules.length}, orphaned: ${orphanModules.length}`
  );
  const blogCount = await Blog.countDocuments();
  const catCount = await BlogCategory.countDocuments();
  console.log(`  blogs: ${blogCount}, blog categories: ${catCount}`);

  await mongoose.disconnect();
})();
