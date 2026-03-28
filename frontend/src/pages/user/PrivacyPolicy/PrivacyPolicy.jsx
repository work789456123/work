import React from "react";
import PrivacyLegalSections from "./components/PrivacyLegalSections";
import PrivacyLiabilitySection from "./components/PrivacyLiabilitySection";
import { privacyPage } from "@/assets/content/privacy";

const PrivacyPolicy = () => {
  return (
    <div id="page-privacy-policy" className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 mt-16 font-sans">
      <div id="privacy-shell" className="bg-teal-50 max-w-[900px] w-full p-10 shadow-lg rounded-xl relative border border-gray-100">
        <div id="privacy-header" className="mb-10 text-center border-b pb-6">
          <h1 id="privacy-page-title" className="text-[32px] font-bold text-[#333]">
            {privacyPage.title}
          </h1>
          <p id="privacy-page-subtitle" className="text-[#6F6F6F] mt-2">
            {privacyPage.subtitle}
          </p>
        </div>

        <div id="privacy-content" className="max-w-4xl mx-auto space-y-8">
          <PrivacyLegalSections />
          <PrivacyLiabilitySection />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
