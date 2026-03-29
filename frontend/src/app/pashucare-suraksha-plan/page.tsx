import PashuCareSurakshaPlan from "@/views/PashuCareSurakshaPlan";
import { surakshaPage } from "@/assets/content/pashucare_suraksha_plan";

export const metadata = {
  title: surakshaPage.badge,
  description: `${surakshaPage.hero.line1} ${surakshaPage.hero.line2}`,
};

export default function PashuCarePage() {
  return <PashuCareSurakshaPlan />;
}
