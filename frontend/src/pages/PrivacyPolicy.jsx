import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4 mt-16 font-sans">
      <div className="bg-white max-w-[900px] w-full p-10 shadow-lg rounded-xl relative border border-gray-100">
        
        {/* Header */}
        <div className="mb-10 text-center border-b pb-6">
          <h1 className="text-[32px] font-bold text-[#111111]">Privacy Policy</h1>
          <p className="text-[#6F6F6F] mt-2">Regulatory Compliance & Risk Management Policy</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Content */}
          <div className="text-[16px] text-gray-700 leading-[1.7] space-y-8">
            
            <section id="s1">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">1. Purpose and Scope</h2>
              <p>This Regulatory Compliance and Risk Management Policy ("Policy") outlines the legal and operational framework governing consultations facilitated through the PashuVaani platform ("Platform").</p>
              <p className="mt-4">This Policy applies to all tele-consultations, advisory sessions, and digital interactions between users ("Pet Parents/Farmers") and veterinary professionals registered on the Platform.</p>
            </section>

            <section id="s2">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">2. Consultation Recording & Monitoring</h2>
              <p>To ensure quality of service, dispute resolution, and regulatory compliance, the Platform reserves the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Record audio/video consultations.</li>
                <li>Archive chat transcripts.</li>
                <li>Store uploaded medical records and images.</li>
              </ul>
              <p className="mt-4">By initiating a consultation, both the user and the veterinary professional provide implicit consent to such recording. These records will be maintained in accordance with the Digital Personal Data Protection Act, 2023, and may be produced if requisitioned by a competent legal or regulatory authority.</p>
            </section>

            <section id="s3">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">3. The "No-VCPR" Clause</h2>
              <p>The Platform operates on the fundamental premise that a valid Veterinary-Client-Patient Relationship (VCPR) <em>cannot be fully established solely through electronic means.</em></p>
              <p className="mt-4">Therefore:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>All consultations provided via the Platform are classified as "Teletriage" or "Informational Guidance".</li>
                <li>They do not substitute an in-person physical examination by a licensed veterinarian.</li>
                <li>Users are explicitly advised to seek physical veterinary care for definitive diagnosis and treatment.</li>
              </ul>
            </section>

            <section id="s4">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">4. Teletriage vs. Diagnosis</h2>
              <p>Veterinary professionals utilizing the Platform are instructed to restrict their services to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Assessing the urgency of the animal's condition (Teletriage).</li>
                <li>Providing general health, nutritional, and behavioral advice.</li>
                <li>Recommending whether immediate physical veterinary intervention is required.</li>
              </ul>
              <p className="mt-4">The Platform strictly prohibits the formulation of definitive medical diagnoses solely based on remote consultations.</p>
            </section>

            <section id="s5">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">5. Disclaimer Regarding AI Disease Identification</h2>
              <p>The AI-driven disease identification tool provided on the Platform is designed strictly for screening and informational purposes.</p>
              <p className="mt-4">It is not a diagnostic tool.</p>
              <p className="mt-4">The Platform makes no representation or warranty regarding the accuracy, completeness, or reliability of the AI tool's output.</p>
              <p className="mt-4">Any condition flagged by the AI tool must be verified by a qualified veterinary professional through a physical examination.</p>
            </section>

            <section id="s6">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">6. Prescription Control & Monitoring</h2>
              <p>The issuance of electronic prescriptions via the Platform is strictly regulated:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Routine medications (e.g., dewormers, basic supplements) may be prescribed at the discretion of the veterinary professional.</li>
                <li>Prescription of Schedule H, Schedule H1, Schedule X drugs, Narcotics, Psychotropic substances, and specific antibiotics is strictly prohibited without a prior, documented physical examination.</li>
                <li>The Platform employs automated monitoring to flag the unauthorized prescription of restricted substances.</li>
              </ul>
            </section>

            <section id="s7">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">7. Emergency Disclaimer</h2>
              <p>The Platform is not designed, intended, or equipped to handle veterinary emergencies.</p>
              <p className="mt-4">In cases involving severe trauma, respiratory distress, profuse bleeding, or sudden collapse, users are directed to bypass the Platform and immediately transport the animal to the nearest veterinary hospital or clinic.</p>
            </section>

            <section id="s8">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">8. Data Protection & Privacy</h2>
              <p>PashuVaani implements robust technical and organizational measures to safeguard user data and animal health records.</p>
              <p className="mt-4">Data processing is conducted in strict compliance with applicable laws, including but not limited to the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023.</p>
            </section>

            <section id="s9">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">9. Platform Role Clarification</h2>
              <p>PashuVaani operates exclusively as a technology intermediary, facilitating communication between users and independent veterinary professionals.</p>
              <p className="mt-4">The Company does not practice veterinary medicine, does not independently diagnose or treat animals, and exercises no clinical control over the veterinary professionals on the Platform.</p>
            </section>

            <section id="s10">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">10. Compliance Monitoring</h2>
              <p>The Company reserves the right to conduct periodic compliance audits of consultations conducted on the Platform.</p>
              <p className="mt-4">Veterinary professionals found in violation of regulatory guidelines or Platform policies may face immediate suspension or permanent removal from the Platform.</p>
            </section>

            <section id="s11">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">11. Professional Indemnity Insurance</h2>
              <p>Veterinary professionals registered on the Platform are required to maintain valid professional indemnity insurance. Registration on the Platform constitutes a declaration of such coverage by the professional.</p>
            </section>

            <section id="s12">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">12. Governing Law & Jurisdiction</h2>
              <p>This Policy, and any disputes arising from it, shall be governed by the laws of India. The courts of Mumbai, India, shall have exclusive jurisdiction over any such disputes.</p>
            </section>

            <section id="s13">
              <h2 className="text-[22px] font-semibold text-gray-900 mb-4">13. Limitation of Liability</h2>
              <p>To the fullest extent permitted by law, PashuVaani its directors, employees, and consultants shall not be liable for any direct, indirect, incidental, or consequential damages, or for any injury, loss, illness, or death of an animal arising out of or in connection with the use of the Platform.</p>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-400 mb-3">Last updated: {new Date().toLocaleDateString()}</p>
                <Link to="/" className="text-sm text-[#1F6559] font-medium hover:underline flex items-center gap-1">
                  ← Back to Home
                </Link>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
