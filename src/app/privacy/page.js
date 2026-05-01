"use client";

import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy text-white pt-20 pb-40 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-black mb-4">Privacy Policy</h1>
          <p className="text-blue-200">Last Updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="card p-10 bg-white shadow-xl space-y-8 text-navy">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Welcome to BharatVote. We are committed to protecting your personal information and your right to privacy. This policy explains how we handle the information you provide during your electoral literacy journey.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-sm leading-relaxed text-text-secondary mb-4">
              BharatVote is an educational simulation platform. We collect minimal information required to provide a personalized experience:
            </p>
            <ul className="list-disc ml-6 text-sm text-text-secondary space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and profile photo via Google Auth.</li>
              <li><strong>Simulation Data:</strong> Address, DOB, and ID type provided during the "Journey" modules.</li>
              <li><strong>AI Interactions:</strong> Questions asked to Chunav Mitra to improve response quality.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Your data is used solely for educational simulations (e.g., populating a sample Digital ID card) and for maintaining your progress across the 7 stages of the electoral journey. We do NOT share your data with third parties for commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              We use industry-standard security measures provided by Google Firebase to protect your data. However, please note that this is an educational platform; users should never upload sensitive real-world documents or passwords.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              You have the right to access, update, or delete your data at any time through your Profile settings.
            </p>
          </section>

          <div className="pt-8 border-t border-cream text-center">
            <p className="text-xs text-text-muted">
              For any privacy concerns, contact us at <span className="font-bold">privacy@bharatvote.in</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
