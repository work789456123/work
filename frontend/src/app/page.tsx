import Home from "@/views/Home/Home";
import { hero } from "@/assets/content/home";

export const dynamic = "force-static";

export const metadata = {
  title: hero.title,
  description: hero.descriptionLines.join(" "),
};

export default function HomePage() {
  return <Home />;
}
