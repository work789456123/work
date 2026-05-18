import Accreditations from "@/views/Accreditations";
import { aboutAccreditations } from "@/assets/content/about";

export const dynamic = "force-static";

export const metadata = {
  title: aboutAccreditations.title,
  description: aboutAccreditations.subtitle,
};

export default function AccreditationsPage() {
  return <Accreditations />;
}
