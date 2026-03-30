import Blogs from "@/views/Blogs";
import { blogsHeader } from "@/assets/content/blogs";

export const dynamic = "force-static";

export const metadata = {
  title: blogsHeader.title,
  description: blogsHeader.subtitle,
};

export default function BlogsPage() {
  return <Blogs />;
}
