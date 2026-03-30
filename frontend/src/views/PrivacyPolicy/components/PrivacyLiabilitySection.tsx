import Link from "next/link";
import { privacyLiability } from "@/assets/content/privacy";

export default function PrivacyLiabilitySection() {
  return (
    <section id="privacy-liability">
      <h2 className="text-[22px] font-semibold text-gray-900 mb-4">{privacyLiability.sectionTitle}</h2>
      <p>{privacyLiability.body}</p>
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-400 mb-3">
          {privacyLiability.lastUpdatedPrefix} {new Date().toLocaleDateString()}
        </p>
        <Link
          href="/"
          className="text-sm text-[#1F6559] font-medium hover:underline flex items-center gap-1"
        >
          {privacyLiability.backHome}
        </Link>
      </div>
    </section>
  );
}
