"use client";

import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-navy text-white pt-20 pb-40 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl font-black mb-4">Terms of Service</h1>
          <p className="text-blue-200">Last Updated: May 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 pb-20 relative z-20">
        <div className="card p-10 bg-white shadow-xl space-y-8 text-navy">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              By accessing BharatVote, you agree to be bound by these Terms of Service and all applicable laws in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">2. Educational Purposes Only</h2>
            <p className="text-sm leading-relaxed text-text-secondary bg-saffron/5 p-4 rounded-xl border border-saffron/10 italic">
              <strong>IMPORTANT:</strong> BharatVote is an educational simulation and literacy tool. It is NOT an official government application. Using this platform does NOT register you to vote in real life. Please visit <strong>voters.eci.gov.in</strong> for official registration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">3. User Conduct</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Users agree to use the platform for lawful purposes only. Any attempt to spread misinformation or disrupt the service is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">4. AI Disclaimer</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              Chunav Mitra (AI) provides assistance based on trained models. While we strive for accuracy, AI can make mistakes. Always cross-verify critical information with official Election Commission of India (ECI) guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">5. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              BharatVote shall not be held liable for any decisions made based on the simulated data or AI responses provided on this platform.
            </p>
          </section>

          <div className="pt-8 border-t border-cream text-center">
            <p className="text-xs text-text-muted">
              By continuing to use BharatVote, you acknowledge these terms.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
