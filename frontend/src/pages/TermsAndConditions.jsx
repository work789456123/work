import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const THRESHOLD = 10; // Pixels from bottom to trigger scroll detection

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [consents, setConsents] = useState({
    readAndUnderstood: false,
    teletriageOnly: false,
    noVcpr: false,
    noReplaceInPerson: false,
  });

  const allConsented = Object.values(consents).every(Boolean);
  const canAccept = hasScrolledToBottom && allConsented;

  const handleScroll = useCallback(() => {
    if (hasScrolledToBottom || !contentRef.current) return;

    // Check if window has scrolled to bottom of the content container
    const { bottom } = contentRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (bottom <= windowHeight + THRESHOLD) {
      setHasScrolledToBottom(true);
    }
  }, [hasScrolledToBottom]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initially in case content fits on screen
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setConsents(prev => ({ ...prev, [name]: checked }));
  };

  const handleAccept = () => {
    localStorage.setItem('pashuvaani_terms_accepted', 'true');
    // Save timestamp if needed: localStorage.setItem('pashuvaani_terms_accepted_at', new Date().toISOString());
    navigate('/');
  };



  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[900px] mx-auto bg-teal-50 rounded-2xl shadow-sm p-6 sm:p-10">
        <h1 className="text-[32px] font-bold text-gray-900 mb-8 text-center border-b pb-6">
          Terms & Conditions
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div
            ref={contentRef}
            className="flex-1 order-1 md:order-2 text-[16px] leading-[1.7] text-gray-700"
          >
            <div className="space-y-8">
              <section id="s1">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using the PashuVaani platform, you confirm that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>You have read and understood these Terms</li>
                  <li>You agree to comply with these Terms</li>
                  <li>You consent to the collection and processing of data as described in our Privacy Policy</li>
                </ul>
                <p className="mt-4">If you do not agree to these Terms, you must not use the Platform.</p>
              </section>

              <section id="s2">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">2. Description of Services</h2>
                <p>PashuVaani is a <em>technology platform designed to support animal health awareness and veterinary access through digital tools.</em></p>
                <p className="mt-4">The Platform provides:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>AI-based disease identification tools</li>
                  <li>Teletriage and informational veterinary consultations</li>
                  <li>Educational resources related to animal health</li>
                  <li>Access to independent Registered Veterinary Practitioners (RVPs)</li>
                </ul>
                <p className="mt-4">The Platform operates <em>strictly as a technology intermediary</em> facilitating communication between users and independent veterinary professionals.</p>
              </section>

              <section id="s3">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">3. No Veterinary-Client-Patient Relationship (VCPR)</h2>
                <p className="font-bold">IMPORTANT NOTICE</p>
                <p className="mt-2">Use of the Platform, including the <em>"Vet on Call"</em> feature or <em>AI disease identification tools</em>, <em>does not establish a Veterinary-Client-Patient Relationship (VCPR)</em> between:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>The user</li>
                  <li>The animal</li>
                  <li>PashuVaani</li>
                  <li>Any consulting veterinary professional</li>
                </ul>
                <p className="mt-4">Because consultations occur remotely without physical examination, veterinarians may be legally restricted from diagnosing, treating, or prescribing medications depending on applicable regulations.</p>
                <p className="mt-4">Users must seek <em>in-person veterinary care</em> for proper diagnosis and treatment.</p>
              </section>

              <section id="s4">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">4. Scope of Service: Teletriage Only</h2>
                <p>Services provided by PashuVaani are limited to <em>teletriage and general animal health guidance.</em></p>
                <p className="mt-4">The Platform MAY provide:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>General advice about animal health concerns</li>
                  <li>Guidance on urgency of veterinary care</li>
                  <li>Recommendations to visit a veterinary clinic</li>
                  <li>Educational information about symptoms</li>
                </ul>
                <p className="mt-4">The Platform DOES NOT provide:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Definitive medical diagnoses</li>
                  <li>Treatment plans</li>
                  <li>Surgical or emergency medical care</li>
                  <li>Guaranteed medical outcomes</li>
                </ul>
                <p className="mt-4 font-bold">Any medical decisions should be made only after consulting a licensed veterinarian in person.</p>
              </section>

              <section id="s5">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">5. AI Disease Identification Disclaimer</h2>
                <p>The Platform may include <strong>AI-powered disease identification tools</strong>.</p>
                <p className="mt-4">These tools:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Analyze images, videos, or text submitted by users</li>
                  <li>Provide <em>probability-based suggestions</em></li>
                  <li>Are <em>not medical diagnostic devices</em></li>
                </ul>
                <p className="mt-4">AI outputs may contain:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>False positives</li>
                  <li>False negatives</li>
                  <li>Incomplete or inaccurate results</li>
                </ul>
                <p className="mt-4">Users must <em>not administer medication or perform treatment solely based on AI results</em> without consulting a licensed veterinarian.</p>
              </section>

              <section id="s6">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">6. Veterinary Professionals</h2>
                <p>Veterinary professionals available on the Platform:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Are independent Registered Veterinary Practitioners</li>
                  <li>Are responsible for their professional conduct</li>
                  <li>Maintain applicable veterinary registrations</li>
                </ul>
                <p className="mt-4">The Company does not control clinical decisions made by veterinary professionals.</p>
                <p className="mt-4">Each veterinary professional remains individually responsible for medical advice provided.</p>
              </section>

              <section id="s7">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">7. Consultation Recording & Record Retention</h2>
                <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">Consultation Recording</h3>
                <p>Where legally permissible:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Audio or video consultations may be recorded</li>
                  <li>Recording occurs <em>only after explicit user consent</em></li>
                </ul>
                <p className="mt-4">Users may decline recording where permitted.</p>

                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-2">Record Retention</h3>
                <p>The Platform may maintain secure records including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Consultation transcripts</li>
                  <li>Veterinary notes</li>
                  <li>Prescriptions</li>
                  <li>Consent records</li>
                </ul>
                <p className="mt-4">These records are stored in accordance with applicable data protection laws.</p>
              </section>

              <section id="s8">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">8. Prescription Control & Monitoring</h2>
                <p>Where prescriptions are issued:</p>
                <p className="mt-2">The Platform may maintain secure logs including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Date of prescription</li>
                  <li>Name of prescribing veterinarian</li>
                  <li>Veterinary registration number</li>
                  <li>Medication details</li>
                  <li>Dosage instructions</li>
                </ul>
                <p className="mt-4">Certain medications may require:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Additional regulatory compliance</li>
                  <li>Physical examination of the animal</li>
                  <li>Verification of veterinary credentials</li>
                </ul>
                <p className="mt-4">The Company reserves the right to <em>audit prescription activity.</em></p>
              </section>

              <section id="s9">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">9. Emergency Disclaimer</h2>
                <p>PashuVaani <em>is not an emergency veterinary service.</em></p>
                <p className="mt-4">If your animal is experiencing any of the following:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Severe injury</li>
                  <li>Poisoning</li>
                  <li>Breathing difficulty</li>
                  <li>Seizures</li>
                  <li>Heavy bleeding</li>
                  <li>Loss of consciousness</li>
                  <li>Life-threatening symptoms</li>
                </ul>
                <p className="mt-4">You must <em>immediately contact a veterinary hospital or visit the nearest veterinary clinic.</em></p>
                <p className="mt-4">The Platform should not be used in emergency situations.</p>
              </section>

              <section id="s10">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">10. User Responsibilities</h2>
                <p>Users agree to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Provide accurate information about animals</li>
                  <li>Not misuse the Platform</li>
                  <li>Not rely solely on AI tools for medical decisions</li>
                  <li>Seek professional veterinary care when necessary</li>
                </ul>
                <p className="mt-4">Users remain responsible for the <em>health and welfare of their animals.</em></p>
              </section>

              <section id="s11">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">11. Use of Customer Data for Internal Research, Analytics and Business Purposes</h2>
                <p>The Customer hereby provides explicit consent to the Company to collect, store, process, analyze, and use the personal and non-personal data, information, documents, and transaction details submitted by the Customer through the Company's website, mobile application, or any other platform, in accordance with applicable laws including the Digital Personal Data Protection Act, 2023 and regulatory requirements issued by the Reserve Bank of India, where applicable.</p>
                <p className="mt-4">The Company may use such data for legitimate business purposes including but not limited to:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-2">
                  <li>Internal research, statistical analysis, and generation of data insights.</li>
                  <li>Product development, service enhancement, and improvement of customer experience.</li>
                  <li>Risk assessment, fraud prevention, credit evaluation, and internal business analytics.</li>
                  <li>Development of internal benchmarks, models, algorithms, and business intelligence tools.</li>
                  <li>Regulatory reporting, compliance monitoring, and audit requirements.</li>
                </ol>
                <p className="mt-4">The Customer acknowledges and agrees that the Company may create aggregated, anonymized, or de-identified datasets derived from the information provided by the Customer. Such datasets shall not contain any information that directly identifies the Customer and may be used by the Company for research, analytics, product innovation, and strategic business purposes.</p>
                <p className="mt-4">The Company shall implement reasonable security safeguards and data protection measures to protect Customer information from unauthorized access, disclosure, alteration, or misuse.</p>
                <p className="mt-4">The Company shall not disclose or share personally identifiable information of the Customer with any third party for research or commercial purposes without obtaining the Customer's consent, except where such disclosure is required under applicable law, regulatory direction, court order, or governmental authority.</p>
                <p className="mt-4">All analytical outputs, research findings, algorithms, reports, and derivative data generated from such information shall remain the exclusive intellectual property of the Company.</p>
                <p className="mt-4">The Customer retains the rights available under applicable data protection laws, including the right to access, correction, or withdrawal of consent, subject to legal and contractual limitations.</p>
              </section>

              <section id="s12">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">12. Data Protection & Privacy</h2>
                <p>PashuVaani implements technical and organizational measures to protect user data.</p>
                <p className="mt-4">Data processing follows applicable laws including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Information Technology Act, 2000</li>
                  <li>Digital Personal Data Protection Act, 2023</li>
                  <li>Applicable Indian data protection regulations</li>
                </ul>
                <p className="mt-4">Security measures include:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Access control systems</li>
                  <li>Audit logging</li>
                  <li>Secure server infrastructure</li>
                </ul>
                <p className="mt-4">Users should review the <em>Privacy Policy</em> for full details.</p>
              </section>

              <section id="s13">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">13. Professional Indemnity Insurance</h2>
                <p>Veterinary professionals on the Platform are required to:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Maintain valid professional indemnity insurance</li>
                  <li>Provide proof of coverage periodically</li>
                </ul>
                <p className="mt-4">The Company may maintain additional insurance coverage including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Cyber liability insurance</li>
                  <li>Technology errors & omissions insurance</li>
                </ul>
                <p className="mt-4">Insurance coverage does not constitute admission of liability.</p>
              </section>

              <section id="s14">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">14. Limitation of Liability</h2>
                <p>By using the Platform, you acknowledge that:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Information provided may be based on incomplete data</li>
                  <li>Remote consultations cannot replace physical examinations</li>
                </ul>
                <p className="mt-4">PashuVaani and its consultants <em>shall not be liable for any injury, loss, illness, or death of an animal arising from reliance on the Platform's services.</em></p>
                <p className="mt-4">Final responsibility for the animal's health remains with the user and their local veterinarian.</p>
              </section>

              <section id="s15">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">15. Platform Role Clarification</h2>
                <p>PashuVaani operates strictly as a <em>technology intermediary.</em></p>
                <p className="mt-4">The Company:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Does not practice veterinary medicine</li>
                  <li>Does not independently diagnose or treat animals</li>
                  <li>Does not control veterinary clinical decisions</li>
                </ul>
                <p className="mt-4">Veterinary professionals are responsible for all medical advice provided.</p>
              </section>

              <section id="s16">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">16. Compliance Monitoring</h2>
                <p>The Company may:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Conduct compliance audits</li>
                  <li>Suspend or remove veterinary professionals violating regulations</li>
                  <li>Update policies to reflect legal requirements</li>
                </ul>
                <p className="mt-4">Continued use of the Platform constitutes acceptance of updated policies.</p>
              </section>

              <section id="s17">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">17. Intellectual Property</h2>
                <p>All Platform content including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Software</li>
                  <li>Design</li>
                  <li>AI models</li>
                  <li>Branding</li>
                  <li>Text and graphics</li>
                </ul>
                <p className="mt-4">is owned by PashuVaani or its licensors and is protected under intellectual property laws.</p>
                <p className="mt-4">Users may not reproduce, distribute, or modify Platform content without permission.</p>
              </section>

              <section id="s18">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">18. Termination of Access</h2>
                <p>The Company may suspend or terminate access to the Platform if a user:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Violates these Terms</li>
                  <li>Misuses the Platform</li>
                  <li>Provides fraudulent information</li>
                  <li>Engages in harmful or illegal conduct</li>
                </ul>
              </section>

              <section id="s19">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">19. Governing Law & Jurisdiction</h2>
                <p>These Terms shall be governed by the laws of India.</p>
                <p className="mt-4">Any disputes arising from the use of the Platform shall fall under the <em>exclusive jurisdiction of the courts located in Mumbai, India.</em></p>
              </section>

              <section id="s20">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">20. Changes to Terms</h2>
                <p>PashuVaani may modify these Terms periodically to reflect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-2">
                  <li>Legal requirements</li>
                  <li>Platform updates</li>
                  <li>Regulatory developments</li>
                </ul>
                <p className="mt-4">Users will be notified of significant changes where required.</p>
                <p className="mt-4">Continued use of the Platform constitutes acceptance of updated Terms.</p>
              </section>

              <section id="s21">
                <h2 className="text-[22px] font-semibold text-gray-900 mb-4">21. User Consent</h2>
                <p>By using the Platform, you confirm that you have read and accepted these terms.</p>
              </section>
            </div>

            {/* Checkboxes Area */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Your Consent</h3>

              {!hasScrolledToBottom && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-sm text-yellow-700">Please read through all terms to the bottom before accepting.</p>
                </div>
              )}

              <div className="space-y-4">
                <label className="flex items-start cursor-pointer group">
                  <div className="flex items-center h-6 mt-0.5">
                    <input
                      type="checkbox"
                      name="readAndUnderstood"
                      checked={consents.readAndUnderstood}
                      onChange={handleCheckboxChange}
                      disabled={!hasScrolledToBottom}
                      className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3">
                    <span className={`text-base font-medium ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-800'}`}>
                      I have read and understood these Terms & Conditions
                    </span>
                  </div>
                </label>

                <label className="flex items-start cursor-pointer group">
                  <div className="flex items-center h-6 mt-0.5">
                    <input
                      type="checkbox"
                      name="teletriageOnly"
                      checked={consents.teletriageOnly}
                      onChange={handleCheckboxChange}
                      disabled={!hasScrolledToBottom}
                      className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3">
                    <span className={`text-base font-medium ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-800'}`}>
                      I understand that the platform provides <em className="not-italic font-bold">teletriage and informational guidance only</em>
                    </span>
                  </div>
                </label>

                <label className="flex items-start cursor-pointer group">
                  <div className="flex items-center h-6 mt-0.5">
                    <input
                      type="checkbox"
                      name="noVcpr"
                      checked={consents.noVcpr}
                      onChange={handleCheckboxChange}
                      disabled={!hasScrolledToBottom}
                      className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3">
                    <span className={`text-base font-medium ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-800'}`}>
                      I acknowledge that <em className="not-italic font-bold">no Veterinary-Client-Patient Relationship is established</em>
                    </span>
                  </div>
                </label>

                <label className="flex items-start cursor-pointer group">
                  <div className="flex items-center h-6 mt-0.5">
                    <input
                      type="checkbox"
                      name="noReplaceInPerson"
                      checked={consents.noReplaceInPerson}
                      onChange={handleCheckboxChange}
                      disabled={!hasScrolledToBottom}
                      className="w-5 h-5 text-[#1F6559] bg-gray-100 border-gray-300 rounded focus:ring-[#1F6559] focus:ring-2 disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3">
                    <span className={`text-base font-medium ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-800'}`}>
                      I agree that the platform <em className="not-italic font-bold">does not replace in-person veterinary care</em>
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-8 flex flex-col items-center sm:items-start">
                <Button
                  onClick={handleAccept}
                  disabled={!canAccept}
                  className="w-full sm:w-auto px-8 py-3 text-lg rounded-full bg-[#1F6559] text-white hover:bg-[#184F46] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Accept Terms
                </Button>
                {!canAccept && hasScrolledToBottom && (
                  <p className="text-sm text-red-500 mt-2 text-center sm:text-left">
                    Please check all boxes above to continue.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
