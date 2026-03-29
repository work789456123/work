import AboutUs from "@/views/AboutUs/AboutUs";
import { aboutHero } from "@/assets/content/about";

export const dynamic = "force-static";

export const metadata = {
  title: aboutHero.title,
  description: aboutHero.subtitle,
};

export default function AboutPage() {
  return <AboutUs />;
}
