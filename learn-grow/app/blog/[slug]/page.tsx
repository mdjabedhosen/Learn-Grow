import { Metadata } from "next";
import BlogDetailClient from "./page-client";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const apiBase = () =>
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005/api").replace(
    /\/+$/,
    ""
  );

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const safeSlug = typeof slug === "string" ? slug.split("?")[0] : "";

  try {
    const res = await fetch(`${apiBase()}/blog/slug/${encodeURIComponent(safeSlug)}`, {
      next: { revalidate: 60 },
    });
    const json: any = await res.json();
    const blog = json?.data;

    if (!blog) {
      return { title: "Blog | Learn & Grow" };
    }

    const canonical = `https://learnandgrow.io/blog/${safeSlug}`;

    return {
      title: blog.title,
      description: blog.excerpt || blog.title,
      alternates: { canonical },
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.title,
        url: canonical,
        type: "article",
        images: blog.image ? [{ url: blog.image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.excerpt || blog.title,
        images: blog.image ? [blog.image] : undefined,
      },
    };
  } catch {
    return { title: "Blog | Learn & Grow" };
  }
}

export default async function BlogDetailPage({
  params,
}: BlogPostPageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
