import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogsHeader, blogList, readMoreLabel } from "@/assets/blogs";

const Blogs = () => {
  const navigate = useNavigate();
  const h = blogsHeader;

  return (
    <div className="py-20 bg-gradient-to-b from-[#1FA7A6] via-[#38C2B4] to-[#78D65C]/10">
      <div className="heading-font text-2xl lg:text-2xl font-bold text-white">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">{h.title}</h1>
          <p className="text-white-500 mt-3">{h.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-auto max-w-screen-[1400px] px-6">
          {blogList.map((blog) => (
            <Card key={blog.id} className=" space-y-4 rounded-xl">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg rounded-b-none rounded-bl-none"
              />
              <div className="content p-4 pt-2">
                <h3 className="text-lg font-bold mb-2 text-[#333]">{blog.title}</h3>
                <p className="text-gray-500 mb-4 text-sm">{blog.description}</p>
                <Button onClick={() => navigate(`/blogs/${blog.id}`)}>{readMoreLabel}</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
