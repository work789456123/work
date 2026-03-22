import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Blogs = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      id: "pashuvaani-ai-animal-health",
      title:
        "How PashuVaani is Bringing AI to Animal Health in India: From Smart Pets to Smart Dairy Farms",
      description:
        "Discover how PashuVaani is using AI-powered early guidance to transform animal health in India.",
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee",
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <div className="heading-font text-2xl lg:text-2xl font-bold text-white">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Blogs</h1>
          <p className="text-white-500 mt-3">
            Learn about animal health and care
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card key={blog.id} className="p-6 space-y-4 rounded-xl">

              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg"
              />

              <h3 className="text-xl font-semibold">
                {blog.title}
              </h3>

              <p className="text-gray-500">
                {blog.description}
              </p>

              <Button
                onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                Read More
              </Button>

            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;