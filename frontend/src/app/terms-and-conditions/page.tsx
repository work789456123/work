import TermsAndConditions from "@/views/TermsAndConditions/TermsAndConditions";
import { termsPage } from "@/assets/content/terms_and_conditions";

export const metadata = {
  title: termsPage.title,
  description: "Terms and conditions for using PashuVaani.",
};

export default function TermsPage() {
  return <TermsAndConditions />;
}
