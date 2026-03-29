import { useState, useRef, useEffect, useCallback, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";

const THRESHOLD = 10; // Pixels from bottom to trigger scroll detection

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Check auth and previous acceptance on mount
  useEffect(() => {
    const checkTerms = () => {
      const token = localStorage.getItem('token');
      const termsAccepted = localStorage.getItem('pashuvaani_terms_accepted') === 'true';

      // If user is logged in but hasn't accepted terms, show modal
      if (token && !termsAccepted) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    checkTerms();

    // Listen to storage events or custom events if need to trigger re-check
    window.addEventListener('storage', checkTerms);
    // Custom event to manually trigger check (e.g., right after login)
    window.addEventListener('auth-change', checkTerms);

    return () => {
      window.removeEventListener('storage', checkTerms);
      window.removeEventListener('auth-change', checkTerms);
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (hasScrolledToBottom || !scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Check if scrolled to bottom
    if (scrollTop + clientHeight >= scrollHeight - THRESHOLD) {
      setHasScrolledToBottom(true);
    }
  }, [hasScrolledToBottom]);

  // Initial check in case content fits natively
  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow DOM to render fully
      setTimeout(() => handleScroll(), 100);
    }
  }, [isOpen, handleScroll]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsAccepted(e.target.checked);
  };

  const handleAccept = () => {
    localStorage.setItem('pashuvaani_terms_accepted', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-6">
      <div className="bg-teal-50 rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-[600px] max-h-[95vh] sm:max-h-[90vh] h-full sm:h-auto flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:fade-in sm:zoom-in-95 duration-200">
        
        {/* Sticky Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-teal-50 flex-shrink-0 z-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Terms & Conditions</h2>
          <p className="text-center text-sm text-gray-500 mt-1">Please read carefully before continuing</p>
        </div>

        {/* Scrollable Body */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar bg-gray-50 text-[15px] leading-relaxed text-gray-700"
        >
          <div className="space-y-6">
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p>By accessing or using the PashuVaani platform, you confirm that you have read and understood these Terms, agree to comply with them, and consent to the collection and processing of data as described in our Privacy Policy. If you do not agree, you must not use the Platform.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">2. Description of Services</h3>
              <p>PashuVaani is a technology platform designed to support animal health awareness and veterinary access through digital tools. The Platform provides AI-based disease identification tools, teletriage, educational resources, and access to independent Registered Veterinary Practitioners (RVPs). The Platform operates strictly as a technology intermediary.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">3. No Veterinary-Client-Patient Relationship (VCPR)</h3>
              <p className="bg-yellow-100 p-3 rounded-md text-yellow-800 font-medium">IMPORTANT NOTICE: Use of the Platform, including the "Vet on Call" or AI tools, does not establish a Veterinary-Client-Patient Relationship (VCPR) between the user, the animal, PashuVaani, or any consulting veterinary professional.</p>
              <p className="mt-2 text-sm">Because consultations occur remotely without physical examination, veterinarians may be legally restricted from diagnosing, treating, or prescribing medications. Users must seek in-person veterinary care for proper diagnosis and treatment.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">4. Scope of Service: Teletriage Only</h3>
              <p>Services are limited to teletriage and general animal health guidance. The Platform MAY provide general advice, urgency guidance, and educational info. The Platform DOES NOT provide definitive medical diagnoses, treatment plans, surgical care, or guaranteed outcomes. Any medical decisions should be made only after consulting a licensed veterinarian in person.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">5. AI Disease Identification Disclaimer</h3>
              <p>The Platform may include AI-powered tools that provide probability-based suggestions and are not medical diagnostic devices. Outputs may contain false positives, false negatives, or inaccurate results. Users must not administer medication solely based on AI results.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">6. Veterinary Professionals</h3>
              <p>Veterinary professionals are independent Registered Veterinary Practitioners responsible for their professional conduct. The Company does not control clinical decisions made by them.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">7. Consultation Recording & Retention</h3>
              <p>Where legally permissible, audio or video consultations may be recorded only after explicit user consent. Users may decline recording where permitted. Secure records including transcripts, notes, and prescriptions may be maintained in accordance with data protection laws.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">8. Prescription Control & Monitoring</h3>
              <p>Where prescriptions are issued, the Platform may maintain secure logs. Certain medications may require additional compliance, physical examination, or verification. The Company reserves the right to audit prescription activity.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">9. Emergency Disclaimer</h3>
              <p className="font-medium text-red-600">PashuVaani is not an emergency veterinary service.</p>
              <p className="text-sm mt-1">If your animal is experiencing severe injury, poisoning, breathing difficulty, seizures, heavy bleeding, loss of consciousness, or life-threatening symptoms, you must immediately contact a veterinary hospital or visit the nearest clinic.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">10. User Responsibilities & Data Protection</h3>
              <p>Users agree to provide accurate information, not misuse the Platform, not rely solely on AI tools, and seek professional care when necessary. PashuVaani implements technical measures to protect user data following applicable laws (Information Technology Act 2000, DPDP Act 2023).</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">11. Use of Customer Data for Internal Research & Analytics</h3>
              <p>The Customer provides explicit consent for the Company to collect, process, and analyze personal and non-personal data submitted through the Platform for business purposes including research, product development, risk assessment, and regulatory reporting. The Company may create anonymized datasets and implement security safeguards to protect information without disclosing identifiable information without consent, except where required by law.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">12. Insurance, Liability & Role Clarification</h3>
              <p>Veterinary professionals must maintain valid indemnity insurance. PashuVaani and its consultants shall not be liable for any injury, loss, illness, or death arising from reliance on the Platform's services. Final responsibility remains with the user and their local veterinarian. PashuVaani operates strictly as a technology intermediary.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">13. Compliance, Intellectual Property & Termination</h3>
              <p>The Company may conduct audits and suspend users/professionals violating regulations. All content is owned by PashuVaani or licensors. The Company may terminate access for misusing the Platform, fraud, or illegal conduct.</p>
            </section>

            <section>
              <h3 className="font-semibold text-gray-900 mb-2">14. Governing Law & Modification</h3>
              <p>These Terms shall be governed by the laws of India under the exclusive jurisdiction of the courts located in Mumbai. PashuVaani may modify these Terms periodically, and continued use constitutes acceptance.</p>
            </section>

            <p className="text-center font-medium mt-8 text-gray-400">End of Terms</p>
          </div>
        </div>

        {/* Sticky Footer Area */}
        <div className="bg-teal-50 px-6 py-5 border-t border-gray-100 flex-shrink-0 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          {!hasScrolledToBottom && (
             <div className="mb-4 text-sm text-[#D38B22] font-medium text-center animate-pulse">
               Please scroll to the bottom of the terms to continue.
             </div>
          )}

          <label className="flex items-start cursor-pointer group mb-5">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={handleCheckboxChange}
                disabled={!hasScrolledToBottom}
                className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
              />
            </div>
            <div className="ml-3">
              <span className={`text-[15px] leading-snug font-medium transition-colors ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-800'}`}>
                I have read the Terms & Conditions and agree to them.
              </span>
            </div>
          </label>

          <Button 
            onClick={handleAccept}
            disabled={!hasScrolledToBottom || !isAccepted}
            className="w-full py-6 text-[16px] font-semibold rounded-xl bg-[#1F6559] text-white hover:bg-[#184F46] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Accept & Continue
          </Button>
        </div>

      </div>
    </div>
  );
}
