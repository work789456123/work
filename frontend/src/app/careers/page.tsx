import Careers from "@/views/Careers";
import { careersPage } from "@/assets/content/careers";

export const metadata = {
  title: "Careers",
  description: careersPage.hero.subtitle,
};

export default function CareersPage() {
  return <Careers />;
}
