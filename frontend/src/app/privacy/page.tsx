import PrivacyPolicy from "@/views/PrivacyPolicy/PrivacyPolicy";
import { privacyPage } from "@/assets/content/privacy";

export const dynamic = "force-static";

export const metadata = {
  title: privacyPage.title,
  description: privacyPage.subtitle,
};

export default function PrivacyPage() {
  return <PrivacyPolicy />;
}
