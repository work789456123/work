import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import api from "@/utils/api";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await api.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Failed to fetch blog", error);
    }
  };

  if (!blog) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p className="text-[#6F6F6F]">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="blog-detail-page">
      <div className="max-w-4xl mx-auto px-6">
        <Button onClick={() => navigate('/blogs')} variant="ghost" className="mb-8" data-testid="back-to-blogs">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Button>

        {blog.cover_image_url && (
          <img src={blog.cover_image_url} alt={blog.title} className="w-full h-96 object-cover rounded-2xl mb-8" />
        )}

        <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111] mb-6" data-testid="blog-detail-title">{blog.title}</h1>
        <p className="text-lg text-[#6F6F6F] mb-8">{blog.description}</p>
        <div className="prose max-w-none text-[#111111]" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  );
};

export default BlogDetail;