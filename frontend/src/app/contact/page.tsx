import Contact from "@/views/Contact";
import { contactPage } from "@/assets/content/contact";

export const metadata = {
  title: contactPage.title,
  description: contactPage.subtitle,
};

export default function ContactPage() {
  return <Contact />;
}
