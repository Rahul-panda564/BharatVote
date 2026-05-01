"use client";

import { useState } from "react";
import Link from "next/link";
import { generateRTIDraft } from "@/lib/vertex";

const COMPLAINT_TYPES = ["EVM / Error", "Booth Issue", "Violation"];

const RIGHTS = [
  { icon: "🔒", title: "Right to Secrecy", description: "No authority can compel you to reveal who you voted for. Your ballot is strictly confidential under Section 128." },
  { icon: "🛡️", title: "Tendered Vote", description: "If someone has falsely voted in your name, you still have the right to cast a 'Tendered Ballot' to register your true choice." },
];

const PRECEDENTS = [
  { title: "Booth Capture Nullified", status: "Resolved", date: "Oct 2023", detail: "Prompt reporting via the portal led to immediate deployment of central forces and a repoll order within 24 hours.", color: "bg-success" },
  { title: "VVPAT Discrepancy", status: "Under Review", date: "Pending", detail: "A collective petition regarding mismatch in slip counts is currently undergoing verification by the statutory committee.", color: "bg-info" },
];

export default function GrievancePage() {
  const [selectedType, setSelectedType] = useState("EVM / Error");
  const [complaintText, setComplaintText] = useState("");
  const [rtiTopic, setRtiTopic] = useState("");
  const [rtiDraft, setRtiDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRTI = async () => {
    if (!rtiTopic) return;
    setIsGenerating(true);
    try {
      const draft = await generateRTIDraft(rtiTopic);
      setRtiDraft(draft);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream to-white py-12 sm:py-16" aria-labelledby="grievance-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="grievance-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-2">
            Secure Your Vote.<br />
            <span className="text-saffron">Demand Transparency.</span>
          </h1>
          <p className="text-text-secondary max-w-xl text-lg mt-4">
            The Sovereign Grievance Center ensures your democratic rights are uncompromised. Report issues directly, access immediate legal aid, and know your exact standing.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* File Complaint */}
          <div className="lg:col-span-2 card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-5">File a Complaint</h2>
            {/* Type Selector */}
            <div className="flex flex-wrap gap-2 mb-5" role="radiogroup" aria-label="Complaint type">
              {COMPLAINT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  role="radio"
                  aria-checked={selectedType === type}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors ${
                    selectedType === type
                      ? "bg-navy text-white border-navy"
                      : "border-border text-text-secondary hover:border-navy"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <label htmlFor="complaint-desc" className="sr-only">Describe the incident</label>
            <textarea
              id="complaint-desc"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              className="input-field min-h-[140px] mb-4"
              placeholder="Describe the incident..."
            />

            <div className="flex flex-wrap gap-3 mb-5 text-sm text-text-secondary">
              <button className="flex items-center gap-1 hover:text-navy">🎤 Voice Note</button>
              <button className="flex items-center gap-1 hover:text-navy">📎 Evidence</button>
              <button className="flex items-center gap-1 hover:text-navy">📍 Location</button>
            </div>

            <button className="btn-primary px-8" id="submit-complaint">
              Submit Alert →
            </button>

            {/* RTI Draft Preview */}
            {rtiDraft && (
              <div className="mt-10 p-6 bg-cream rounded-2xl border border-saffron/20 animate-fade-in shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-navy">Generated RTI Draft</h3>
                  <button 
                    onClick={() => setRtiDraft("")}
                    className="text-text-muted hover:text-danger text-sm"
                  >
                    Clear
                  </button>
                </div>
                <div className="text-sm text-text-primary whitespace-pre-line leading-relaxed bg-white/50 p-4 rounded-xl border border-white max-h-[400px] overflow-y-auto">
                  {rtiDraft}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button className="btn-secondary text-sm py-2 px-4">Download PDF</button>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(rtiDraft);
                      alert("Copied to clipboard!");
                    }}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Copy Text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Legal Aid */}
            <div className="card p-5">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span className="text-info" aria-hidden="true">⚖️</span> Legal Aid Directory
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-navy">Central Helplink</p>
                    <p className="text-xs text-text-muted">Available 24/7</p>
                  </div>
                  <span className="text-lg font-bold text-saffron">1950</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-cream rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-navy">State Observers</p>
                    <p className="text-xs text-text-muted">Local representation</p>
                  </div>
                  <button className="text-info text-sm font-semibold hover:underline">View List</button>
                </div>
              </div>
            </div>

            {/* RTI Helper */}
            <div className="card p-5 bg-navy text-white">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span aria-hidden="true">📜</span> RTI Helper (Vertex AI)
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Generate an official Right to Information application instantly powered by **Google Vertex AI**.
              </p>
              <label htmlFor="rti-topic" className="sr-only">Select RTI topic</label>
              <select id="rti-topic" value={rtiTopic} onChange={(e) => setRtiTopic(e.target.value)} className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2.5 text-sm mb-3">
                <option value="" className="text-navy">Select Topic...</option>
                <option value="evm" className="text-navy">EVM/VVPAT Data</option>
                <option value="spending" className="text-navy">Candidate Spending</option>
                <option value="results" className="text-navy">Result Verification</option>
                <option value="booth" className="text-navy">Booth Infrastructure</option>
              </select>
              <button 
                onClick={handleGenerateRTI}
                disabled={!rtiTopic || isGenerating}
                className="btn-secondary text-white border-white/30 hover:bg-white hover:text-navy w-full justify-center disabled:opacity-50"
              >
                {isGenerating ? "Processing..." : "Generate Draft"}
              </button>
            </div>
          </div>
        </div>

        {/* Know Your Rights */}
        <section className="mb-12" aria-labelledby="rights-heading">
          <h2 id="rights-heading" className="text-xl font-bold text-navy mb-5">Know Your Rights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RIGHTS.map((right) => (
              <div key={right.title} className="card p-5">
                <span className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-xl mb-3" aria-hidden="true">{right.icon}</span>
                <h3 className="font-bold text-navy mb-2">{right.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{right.description}</p>
              </div>
            ))}
            <div className="card p-5 bg-green-50 border border-green-200">
              <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl mb-3" aria-hidden="true">🏷️</span>
              <h3 className="font-bold text-navy mb-2">Challenge a Vote</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Polling agents can challenge a voter&apos;s identity. If challenged, the Presiding Officer must hold a brief inquiry on the spot to verify credentials.
              </p>
              <button className="text-saffron text-sm font-semibold hover:underline">Read full procedure →</button>
            </div>
          </div>
        </section>

        {/* Recent Precedents */}
        <section aria-labelledby="precedents-heading">
          <h2 id="precedents-heading" className="text-xl font-bold text-navy mb-5">Recent Precedents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PRECEDENTS.map((p) => (
              <div key={p.title} className="card p-5 flex gap-4">
                <span className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center text-white text-lg shrink-0`} aria-hidden="true">
                  {p.status === "Resolved" ? "✓" : "⟳"}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`badge text-[10px] ${p.status === "Resolved" ? "badge-green" : "badge-navy"}`}>{p.status}</span>
                    <span className="text-xs text-text-muted">{p.date}</span>
                  </div>
                  <h3 className="font-bold text-navy mb-1">{p.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
