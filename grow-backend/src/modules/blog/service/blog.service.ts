import { Blog, IBlog } from "../model/blog.model";
import { BlogCategory } from "../model/blog-category.model";
import { escapeRegex } from "@/utils/sanitizeSearch";
import { pickDefined } from "@/utils/pickFields";

/**
 * Fields that may be edited through the blog API.
 *
 * `isApproved` is owned by approveBlog/rejectBlog, `author` is set when the
 * post is created, `viewCount` is a counter and `readTime` is recomputed from
 * the content - none of them may come from the request body.
 */
const BLOG_UPDATABLE_FIELDS = [
  "title",
  "content",
  "excerpt",
  "category",
  "metaTags",
  "image",
  "slug",
  "isPublished",
] as const;

/** Editable fields of a blog category (slug is derived from the name). */
const BLOG_CATEGORY_UPDATABLE_FIELDS = ["name", "slug", "description"] as const;

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Calculate read time (approx 200 words per minute)
const calculateReadTime = (content: string): number => {
  const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};

// ===== BLOG SERVICES =====

export const createBlog = async (data: Partial<IBlog>) => {
  // Use provided slug or generate from title
  const slug = data.slug && data.slug.trim() ? data.slug.trim() : generateSlug(data.title || "");
  const readTime = calculateReadTime(data.content || "");

  return Blog.create({
    ...data,
    slug,
    readTime,
  });
};

/**
 * Fetch a single blog for public display.
 *
 * SECURITY: these used to return ANY blog - drafts and unapproved posts
 * included - to anonymous callers, because the routes are public. A draft is
 * now only visible to an admin/manager (or the author).
 */
const publicBlogFilter = (canViewUnpublished: boolean) =>
  canViewUnpublished ? {} : { isPublished: true, isApproved: true };

export const getBlogById = async (id: string, canViewUnpublished = false) => {
  const filter = { _id: id, ...publicBlogFilter(canViewUnpublished) };

  // Only count a view for a blog that is actually served.
  const existing = await Blog.findOne(filter).select("_id").lean();
  if (!existing) return null;

  return Blog.findByIdAndUpdate(
    id,
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate("author", "name email profileImage")
    .populate("category", "name slug");
};

export const getBlogBySlug = async (
  slug: string,
  canViewUnpublished = false
) => {
  const filter = { slug, ...publicBlogFilter(canViewUnpublished) };

  const existing = await Blog.findOne(filter).select("_id").lean();
  if (!existing) return null;

  return Blog.findOneAndUpdate(
    { slug },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate("author", "name email profileImage")
    .populate("category", "name slug");
};

export const getAllBlogs = async (filters: any = {}) => {
  const query: any = {};

  // Public blogs (published and approved).
  // SECURITY: this used to be `if (!filters.includeUnpublished)`, and the
  // flag arrived from the query string as the literal string "false" - which
  // is truthy, so the filter was skipped and drafts leaked to anonymous
  // callers. It must be the exact string "true", and the controller only
  // passes it through for an admin/manager.
  const includeUnpublished =
    filters.includeUnpublished === true || filters.includeUnpublished === "true";

  if (!includeUnpublished) {
    query.isPublished = true;
    query.isApproved = true;
  }

  // Filter by role/author
  if (filters.authorId) {
    query.author = filters.authorId;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  // Search by title or excerpt
  if (filters.search) {
    const safeSearch = escapeRegex(filters.search);
    if (safeSearch) {
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { excerpt: { $regex: safeSearch, $options: "i" } },
      ];
    }
  }

  const page = Math.max(1, parseInt(filters.page || "1"));
  const limit = Math.max(1, Math.min(50, parseInt(filters.limit || "10")));
  const skip = (page - 1) * limit;

  const blogs = await Blog.find(query)
    .populate("author", "name email profileImage")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Blog.countDocuments(query);

  return {
    blogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getApprovalPendingBlogs = async () => {
  return Blog.find({ isPublished: true, isApproved: false })
    .populate("author", "name email")
    .sort({ createdAt: -1 });
};

export const updateBlog = async (id: string, data: Partial<IBlog>) => {
  // Drop every key that is not explicitly editable (mass-assignment guard).
  const safeData = pickDefined(data, BLOG_UPDATABLE_FIELDS);

  // Recalculate slug if title changed, but allow custom slug
  if (safeData.title && !safeData.slug) {
    safeData.slug = generateSlug(safeData.title);
  } else if (safeData.slug) {
    // Validate and normalize provided slug
    safeData.slug = safeData.slug.trim().toLowerCase().replace(/\s+/g, "-");
  }

  // Recalculate read time if content changed
  if (safeData.content) {
    safeData.readTime = calculateReadTime(safeData.content);
  }

  return Blog.findByIdAndUpdate(id, safeData, {
    new: true,
    runValidators: true,
  });
};

export const deleteBlog = async (id: string) => {
  return Blog.findByIdAndDelete(id);
};

export const approveBlog = async (id: string) => {
  return Blog.findByIdAndUpdate(id, { isApproved: true }, { new: true });
};

export const rejectBlog = async (id: string) => {
  return Blog.findByIdAndUpdate(id, { isApproved: false }, { new: true });
};

// ===== CATEGORY SERVICES =====

export const createCategory = async (data: any) => {
  const slug = generateSlug(data.name);
  return BlogCategory.create({
    ...data,
    slug,
  });
};

export const getAllCategories = async () => {
  return BlogCategory.find().sort({ name: 1 });
};

export const getCategoryBySlug = async (slug: string) => {
  return BlogCategory.findOne({ slug });
};

export const updateCategory = async (id: string, data: any) => {
  const safeData = pickDefined(data, BLOG_CATEGORY_UPDATABLE_FIELDS);
  if (safeData.name) {
    safeData.slug = generateSlug(safeData.name);
  }
  return BlogCategory.findByIdAndUpdate(id, safeData, { new: true });
};

export const deleteCategory = async (id: string) => {
  return BlogCategory.findByIdAndDelete(id);
};
