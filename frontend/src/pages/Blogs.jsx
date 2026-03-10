import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12" data-testid="blogs-page">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="heading-font text-4xl lg:text-5xl font-bold text-[#111111]" data-testid="blogs-heading">Daily Blogs</h1>
          <p className="text-lg text-[#6F6F6F] mt-4">Learn about animal health and care</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="p-6 rounded-2xl border-[#EAEAEA] space-y-4" data-testid="blog-card">
              {blog.cover_image_url && (
                <img src={blog.cover_image_url} alt={blog.title} className="w-full h-48 object-cover rounded-xl" />
              )}
              <h3 className="heading-font text-xl font-semibold text-[#111111]" data-testid="blog-title">{blog.title}</h3>
              <p className="text-[#6F6F6F] line-clamp-3">{blog.description}</p>
              <Button onClick={() => navigate(`/blogs/${blog.id}`)} data-testid="read-more-button" variant="outline" className="rounded-full border-[#EAEAEA]">
                Read More
              </Button>
            </Card>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12 text-[#6F6F6F]">
            <p>No blogs available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;