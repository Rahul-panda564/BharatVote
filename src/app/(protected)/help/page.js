"use client";

import { useState } from "react";
import Link from "next/link";

const TOPICS = [
  { id: "registration", title: "Registration", desc: "Voter ID, Form 6, and eligibility requirements.", icon: "📝" },
  { id: "booth", title: "Polling Booth", desc: "Find your station and understand the queue process.", icon: "📍" },
  { id: "docs", title: "ID Documents", desc: "Valid identity proofs for voting day.", icon: "🆔" },
  { id: "tech", title: "Technical Help", desc: "App troubleshooting and account security.", icon: "🔧" },
];

const TOPIC_CONTENT = {
  registration: [
    { title: "📋 Form 6 — New Registration", items: ["Visit the Journey page and complete Stage 1 (Registration).", "You need your full name, DOB, and residential address.", "Minimum age for voter registration is 18 years."] },
    { title: "✏️ Form 8 — Corrections", items: ["Already registered? Use Form 8 to correct name, address, or photo.", "Navigate to Profile → Update Details to submit corrections.", "Processing takes 7-14 working days after BLO verification."] },
    { title: "🗑️ Form 7 — Deletion/Objection", items: ["Use Form 7 to raise objections against incorrect entries.", "Deceased or shifted voters can be flagged for removal.", "Contact your local ERO for expedited processing."] },
    { title: "✅ Eligibility", items: ["Must be an Indian citizen aged 18+ on qualifying date (Jan 1).", "Must be a resident of the constituency you're registering in.", "NRIs can register under Section 20A of the RP Act, 1950."] },
  ],
  booth: [
    { title: "📍 Find Your Booth", items: ["Use Stage 4 (Booth Finder) in the Journey page.", "Enter your locality/ward to see the nearest polling station.", "Each booth serves approximately 1,000-1,500 voters."] },
    { title: "⏰ Polling Day Process", items: ["Polling hours: 7:00 AM to 6:00 PM (may vary by state).", "Carry your EPIC Voter ID or any approved photo ID.", "Queue up, get your finger inked, then proceed to the EVM."] },
    { title: "♿ Accessibility", items: ["All booths have ramp access for wheelchair users.", "Braille-enabled EVMs are available for visually impaired voters.", "Senior citizens (80+) can opt for postal ballot facility."] },
  ],
  docs: [
    { title: "🆔 Accepted IDs for Voting", items: ["EPIC (Voter ID Card) — Primary document.", "Aadhaar Card, Passport, Driving License.", "PAN Card, Bank Passbook with photo, Government ID."] },
    { title: "📸 Photo Requirements", items: ["Recent passport-size photo (white background preferred).", "Face must be clearly visible, no sunglasses or hats.", "For document upload: PDF, JPG, PNG formats (max 5MB)."] },
    { title: "🔄 Lost or Damaged ID", items: ["Apply for a duplicate EPIC via Form 002 online.", "Visit your nearest Voter Facilitation Centre for assistance.", "Digital Voter ID (e-EPIC) can be downloaded from voters.eci.gov.in."] },
  ],
  tech: [
    { title: "🔑 Account & Login", items: ["Use Forgot Password on the login page to reset via email.", "Ensure your email is verified before accessing protected features.", "Clear browser cache if you face repeated login issues."] },
    { title: "📱 App Performance", items: ["BharatVote works best on Chrome, Edge, and Safari.", "Enable JavaScript and disable ad-blockers for full functionality.", "Use a stable internet connection for real-time features."] },
    { title: "📄 Document Upload", items: ["Accepted formats: PDF, JPG, PNG (max 5MB).", "Ensure documents are clear and not blurry.", "If upload fails, try compressing the file first."] },
    { title: "🛡️ Security & Privacy", items: ["Your data is encrypted via Firebase with AES-256.", "We never share personal data with third parties.", "Report suspicious activity via the Email Support below."] },
  ],
};

const FAQS = [
  { q: "How do I update my address on my Voter ID?", a: "You can update your address by filling out Form 8A online through the BharatVote platform. Navigate to 'My Profile', select 'Update Details', and upload a valid proof of your new address (e.g., Aadhaar card, utility bill). Processing usually takes 7-14 working days." },
  { q: "What happens if I lose my connection while casting a digital vote?", a: "The EVM is a standalone machine that does not require internet connectivity. Your vote is recorded locally on the EVM's control unit. If you're referring to online services on BharatVote, your progress is auto-saved and you can resume from where you left off." },
  { q: "How is my biometric data secured?", a: "BharatVote does not collect or store biometric data. All biometric verification is handled directly by the Election Commission's secure infrastructure. Our platform uses Firebase Authentication with industry-standard encryption for account security." },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState(null);

  return (
    <div className="bg-cream min-h-screen">
      {/* Search Header */}
      <section className="bg-navy text-white pt-20 pb-52 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-saffron rounded-full blur-[150px] opacity-10 -translate-y-1/2" />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
           <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-saffron text-[10px] font-black tracking-widest uppercase mb-8 border border-white/10">
             Knowledge Base & Support
           </span>
           <h1 className="text-4xl sm:text-6xl font-black mb-8 tracking-tighter">
             How can we <span className="text-saffron">help you</span> today?
           </h1>
           
           <div className="relative group max-w-2xl mx-auto mt-12 mb-10">
               <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
               <input 
                 type="text"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search for 'Voter ID', 'Form 8', 'Booth Finder'..."
                 className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full py-5 px-10 pr-16 text-lg font-medium placeholder:text-white/40 focus:bg-white focus:text-navy focus:ring-4 focus:ring-saffron/30 transition-all outline-none relative z-10"
               />
               <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl opacity-40 group-focus-within:text-navy group-focus-within:opacity-100 transition-all z-20">🔍</span>
            </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 pb-20 relative z-20">
        
        {/* Topic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           {TOPICS.map(t => (
             <button key={t.id} onClick={() => setActiveTopic(activeTopic === t.id ? null : t.id)} className={`card p-8 border-0 shadow-xl bg-white hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group text-left ${activeTopic === t.id ? 'ring-2 ring-saffron' : ''}`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner transition-colors duration-500 ${activeTopic === t.id ? 'bg-saffron' : 'bg-cream group-hover:bg-saffron'}`}>
                   {t.icon}
                </div>
                <h3 className="text-lg font-black text-navy mb-2 group-hover:text-saffron transition-colors">{t.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed opacity-70 mb-4">{t.desc}</p>
                <span className="text-[10px] font-black text-saffron uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                   {activeTopic === t.id ? 'Close' : 'Open Guide'} <span>{activeTopic === t.id ? '✕' : '→'}</span>
                </span>
             </button>
           ))}
        </div>

        {/* Expanded Topic Content */}
        {activeTopic && TOPIC_CONTENT[activeTopic] && (
          <div className="card p-8 border-0 shadow-xl bg-white mb-16 animate-fade-in">
            <h3 className="text-xl font-black text-navy mb-6 flex items-center gap-3">
              {TOPICS.find(t => t.id === activeTopic)?.icon} {TOPICS.find(t => t.id === activeTopic)?.title} Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {TOPIC_CONTENT[activeTopic].map((section, i) => (
                <div key={i} className="bg-cream rounded-xl p-5 border border-navy/5">
                  <h4 className="font-bold text-navy mb-2 text-sm">{section.title}</h4>
                  <ul className="space-y-2 text-xs text-text-secondary">
                    {section.items.map((item, j) => (
                      <li key={j}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* FAQ Section */}
           <div className="lg:col-span-7 space-y-8">
              <h2 className="text-2xl font-black text-navy flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-saffron text-navy flex items-center justify-center text-xl shadow-lg shadow-saffron/20">?</span>
                Common Questions
              </h2>

              <div className="space-y-4">
                 {FAQS.map((f, i) => (
                   <div key={i} className="card border-0 shadow-lg bg-white overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full text-left p-6 flex items-center justify-between gap-6 hover:bg-cream/50 transition-colors"
                      >
                         <span className="font-bold text-navy text-base leading-tight">{f.q}</span>
                         <span className={`text-2xl transition-transform duration-300 ${openFaq === i ? "rotate-45 text-saffron" : "text-text-muted"}`}>+</span>
                      </button>
                      <div className={`px-6 transition-all duration-500 ease-in-out ${openFaq === i ? "max-h-[300px] pb-8 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                         <p className="text-sm text-text-secondary leading-relaxed pt-2 border-t border-cream">
                           {f.a}
                         </p>
                         <div className="mt-6 flex gap-4">
                            <button className="text-[10px] font-black text-success hover:underline">WAS THIS HELPFUL?</button>
                            <button className="text-[10px] font-black text-text-muted hover:underline">SEND FEEDBACK</button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Sidebar Assistance */}
           <div className="lg:col-span-5 space-y-8">
              {/* AI Assistant Callout - High Contrast Redesign */}
              <div className="card p-10 border-2 border-navy/5 shadow-2xl bg-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-5 mb-8">
                       <div className="w-16 h-16 rounded-2xl bg-navy text-white flex items-center justify-center text-3xl shadow-xl">🤖</div>
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_#27AE60]" />
                             <p className="text-[11px] font-black text-success uppercase tracking-widest bg-success/5 px-3 py-1 rounded-full border border-success/20">Active Now</p>
                          </div>
                          <h3 className="text-2xl font-black text-navy tracking-tighter">Chunav Mitra AI</h3>
                       </div>
                    </div>
                    <p className="text-base text-text-secondary leading-relaxed font-bold mb-10">
                       Ask our specialized AI assistant anything about the Indian Constitution, booth locations, or your registration status.
                    </p>
                    <Link href="/chunav-mitra" className="w-full flex items-center justify-center gap-3 py-5 bg-navy text-white rounded-2xl font-black text-center text-sm shadow-2xl shadow-navy/20 hover:bg-saffron hover:shadow-saffron/20 transition-all uppercase tracking-widest group">
                       START CONVERSATION <span className="group-hover:translate-x-2 transition-transform">➔</span>
                    </Link>
                 </div>
              </div>

            </div>
         </div>

         {/* Still Stuck - Centered Full Width */}
         <div className="max-w-2xl mx-auto mt-16">
           <div className="card p-8 border-0 shadow-xl bg-white text-center">
              <h3 className="text-lg font-black text-navy mb-2">Still Stuck?</h3>
              <p className="text-xs text-text-secondary mb-6">Reach out to our support team for further assistance.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-cream hover:bg-navy hover:text-white transition-all group">
                    <span className="text-xl group-hover:scale-110 transition-transform">📧</span>
                    <div className="text-left">
                       <p className="text-sm font-bold">Email Support</p>
                       <p className="text-[10px] opacity-60">Avg. response: 2 hours</p>
                    </div>
                 </button>
                 <button className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-cream hover:bg-navy hover:text-white transition-all group">
                    <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
                    <div className="text-left">
                       <p className="text-sm font-bold">Call Helpline</p>
                       <p className="text-[10px] opacity-60">Mon-Fri, 9am - 6pm</p>
                    </div>
                 </button>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
}
