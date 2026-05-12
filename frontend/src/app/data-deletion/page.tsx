import { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | PashuVaani",
  description: "Instructions for requesting deletion of your personal data from PashuVaani.",
  alternates: {
    canonical: "https://pashuvaani.com/data-deletion",
  },
};

export default function DataDeletionPage() {
  return (
    <PageShell id="page-data-deletion" className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans">
      <div className="bg-white max-w-4xl w-full p-8 md:p-12 shadow-sm rounded-2xl relative border border-gray-100">
        <div className="mb-10 text-center border-b border-gray-100 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-primary mb-4">
            Data Deletion Instructions
          </h1>
          <p className="text-gray-500">
            Learn how to request the removal of your personal data from our platform.
          </p>
        </div>

        <div className="prose prose-teal max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Overview</h2>
            <p>
              At PashuVaani, we value your privacy and give you full control over your data. In compliance with data protection regulations and Meta/WhatsApp publishing requirements, we provide a straightforward process for you to request the permanent deletion of your personal data, including account details, medical logs, and chat histories.
            </p>
          </section>

          <section className="bg-brand-primary/5 p-6 rounded-xl border border-brand-primary/10">
            <h2 className="text-xl font-semibold text-brand-primary mb-4">2. How to Request Deletion</h2>
            <p className="mb-4">
              To initiate a data deletion request, you must send an email to our support team from the email address associated with your PashuVaani account.
            </p>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm my-6">
              <h3 className="font-semibold text-gray-900 mb-2">Step-by-Step Process:</h3>
              <ol className="list-decimal pl-5 space-y-3">
                <li>Open your email client and compose a new email.</li>
                <li>Send the email to: <a href="mailto:pashuvaani@gmail.com" className="text-brand-primary font-medium hover:underline">pashuvaani@gmail.com</a></li>
                <li>Use the subject line: <strong>"Data Deletion Request - [Your Full Name]"</strong></li>
                <li>In the email body, please include:
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-500">
                    <li>Your full name</li>
                    <li>The registered phone number (important for WhatsApp data deletion)</li>
                    <li>A brief statement confirming that you want your data to be permanently deleted</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. What Happens Next?</h2>
            <p className="mb-3">Once we receive your request:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our team will acknowledge your request via email within 48 hours.</li>
              <li>We may ask for additional verification to ensure the security of your account.</li>
              <li>Your personal data, including appointments and chat logs, will be permanently removed from our active databases.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Processing Timeline</h2>
            <p>
              Please allow up to <strong>30 days</strong> for the full deletion of your data from our systems and backups. Note that some data may be retained if legally required (e.g., financial transaction records for tax purposes), but all identifying personal and medical information will be anonymized or deleted.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
