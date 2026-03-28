import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { aboutCta } from "@/assets/content/about";

export default function AboutClosingCtaSection() {
  const navigate = useNavigate();
  return (
    <section id="about-closing-cta" className="py-20 bg-[#1F6559] text-white">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <h2 className="heading-font text-4xl font-bold">{aboutCta.title}</h2>
        <div className="space-y-2">
          {aboutCta.lines.map((line) => (
            <p key={line} className="text-2xl font-semibold">
              {line}
            </p>
          ))}
        </div>
        <Button
          onClick={() => navigate(aboutCta.path)}
          className="rounded-full bg-teal-50 text-[#1F6559] hover:bg-teal-50/90 px-8 py-6 text-lg font-semibold"
        >
          {aboutCta.button}
        </Button>
      </div>
    </section>
  );
}
