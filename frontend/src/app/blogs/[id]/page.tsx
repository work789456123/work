import BlogDetail from "@/views/BlogDetail";
import { blogList } from "@/assets/content/blogs";
import { blogHelmet } from "@/assets/content/blog_detail";
import type { Metadata } from "next";

export const dynamic = "force-static";

export function generateStaticParams() {
  return blogList.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = blogList.find((b) => b.id === id);
  return {
    title: blog?.title ?? blogHelmet.title,
    description: blog?.description ?? blogHelmet.description,
  };
}

export default function BlogPostPage() {
  return <BlogDetail />;
}
