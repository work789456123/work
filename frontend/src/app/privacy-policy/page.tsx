import { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | PashuVaani",
  description: "Privacy Policy for PashuVaani veterinary platform.",
  alternates: {
    canonical: "https://pashuvaani.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PageShell id="page-privacy-policy" className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="bg-white max-w-4xl w-full p-8 md:p-12 shadow-sm rounded-2xl relative border border-gray-100">
        <div className="mb-10 text-center border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500">
            Last updated: May 12, 2026
          </p>
        </div>

        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <section className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              Welcome to PashuVaani. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile applications, or interact with our WhatsApp chatbot for veterinary consultations and pet healthcare support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Data We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identification Information:</strong> Name, phone number, and email address.</li>
              <li><strong>Appointment Data:</strong> Scheduling details, veterinary consultations, and related medical query information.</li>
              <li><strong>Communication Data:</strong> Chat logs and messages exchanged via our platform or WhatsApp chatbot.</li>
              <li><strong>Technical Data:</strong> Device type, browser information, IP address, and usage statistics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
            <p className="mb-3">Your information is utilized to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitate veterinary appointments and consultations.</li>
              <li>Provide customer support and healthcare guidance via our WhatsApp integration.</li>
              <li>Improve and personalize the platform&apos;s features and content.</li>
              <li>Send notifications regarding your appointments and important platform updates.</li>
              <li>Maintain the security and integrity of our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. WhatsApp Communication Handling</h2>
            <p>
              By opting into our WhatsApp services, you consent to receive messages related to your appointments, pet healthcare updates, and promotional content (if opted-in). All conversations on WhatsApp are end-to-end encrypted in transit. We store communication logs securely to provide continuous and context-aware healthcare support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Protection & Security</h2>
            <p>
              We implement industry-standard security measures including encryption, firewalls, and secure socket layer technology (SSL) to protect your personal and medical information from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Third-Party Services</h2>
            <p>
              We may share your data with trusted third-party service providers (such as payment gateways, WhatsApp Business API providers, and cloud hosting services) strictly for the purpose of operating our platform. These third parties are bound by strict confidentiality agreements and are prohibited from using your data for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Cookies Usage</h2>
            <p>
              Our website uses cookies and similar tracking technologies to track user activity and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          <section className="bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">8. User Rights & Contact</h2>
            <p className="mb-4">
              You have the right to access, update, or delete your personal information. If you wish to exercise any of these rights, or if you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="font-medium text-gray-900">
              <p>Email: <a href="mailto:pashuvaani@gmail.com" className="text-brand-primary hover:underline">pashuvaani@gmail.com</a></p>
              <p className="mt-2 text-sm text-gray-500">For specific instructions on deleting your data, please refer to our <a href="/data-deletion" className="text-brand-primary hover:underline">Data Deletion Policy</a>.</p>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
