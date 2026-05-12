import { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions | PashuVaani",
  description: "Terms and Conditions for using the PashuVaani platform.",
  alternates: {
    canonical: "https://pashuvaani.com/terms-and-conditions",
  },
};

export default function TermsAndConditionsPage() {
  return (
    <PageShell id="page-terms-conditions" className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="bg-white max-w-4xl w-full p-8 md:p-12 shadow-sm rounded-2xl relative border border-gray-100">
        <div className="mb-10 text-center border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-500">
            Last updated: May 12, 2026
          </p>
        </div>

        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the PashuVaani platform, including our website, mobile application, and WhatsApp services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p>
              PashuVaani provides a digital platform connecting pet and livestock owners with veterinary professionals. Services include appointment booking, telemedicine consultations, pet healthcare tracking, and automated support via WhatsApp. We act as an intermediary and technology provider.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate and complete information when creating an account or booking an appointment.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree not to use the platform for any unlawful purpose or in any way that interrupts, damages, or impairs the service.</li>
            </ul>
          </section>

          <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
            <h2 className="text-xl font-semibold text-orange-900 mb-4">4. Consultation Disclaimer & Service Limitations</h2>
            <p className="text-orange-800">
              The information and telemedicine services provided through PashuVaani are not a substitute for physical veterinary examinations, diagnosis, or treatment. <strong>In case of a severe medical emergency, please visit the nearest veterinary clinic immediately.</strong> PashuVaani does not guarantee specific medical outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Account Usage Rules</h2>
            <p>
              Users must not create multiple abusive accounts or engage in fraudulent activities. We reserve the right to suspend or terminate accounts that violate our community guidelines, exhibit abusive behavior towards veterinary professionals, or misuse our WhatsApp integration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality on the platform, including text, graphics, logos, and software, are the exclusive property of PashuVaani and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, PashuVaani, its directors, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Termination Policy</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              If you have any questions about these Terms, please contact us at <a href="mailto:pashuvaani@gmail.com" className="text-brand-primary hover:underline">pashuvaani@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
