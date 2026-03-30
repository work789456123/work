import OurStory from "@/views/OurStory";
import { ourStoryHero } from "@/assets/content/our_story";

export const dynamic = "force-static";

export const metadata = {
  title: ourStoryHero.title,
  description: ourStoryHero.subtitle,
};

export default function OurStoryPage() {
  return <OurStory />;
}
