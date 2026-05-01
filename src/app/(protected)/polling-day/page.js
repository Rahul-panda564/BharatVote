"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const EVMMachine = dynamic(() => import("@/components/EVMMachine"), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-cream rounded-3xl animate-pulse flex items-center justify-center text-text-muted">Loading 3D Simulator...</div>
});

const CANDIDATES = [
  { id: 1, name: "Candidate Alpha", party: "Party A", icon: "⭐", color: "bg-amber-400" },
  { id: 2, name: "Candidate Beta", party: "Party B", icon: "🌿", color: "bg-green-500" },
  { id: 3, name: "NOTA", party: "None of the Above", icon: "🚫", color: "bg-gray-400" },
];

const BOOTH_STAGES = [
  { id: 1, title: "Queue & Entry", description: "Join the queue at your assigned booth. Keep your ID ready.", status: "completed" },
  { id: 2, title: "Officer Check", description: "Present your EPIC to the Presiding Officer. Get your finger inked.", status: "completed" },
  { id: 3, title: "EVM & VVPAT Interaction", description: "Press the button next to your chosen candidate. Verify on VVPAT.", status: "current" },
  { id: 4, title: "VVPAT Verification", description: "Check the printed slip through the transparent window for 7 seconds.", status: "pending" },
  { id: 5, title: "Exit Booth", description: "Your vote is cast! Exit through the designated door.", status: "pending" },
];

const COMMON_ERRORS = [
  { title: "Mobile Phones Prohibited", description: "Leave your phone outside the 100m radius of the booth.", severity: "danger" },
  { title: "Incomplete Press", description: "Ensure you press the blue button firmly until you hear the beep.", severity: "warning" },
  { title: "Wrong Queue", description: "Check your serial number and queue at the correct polling station.", severity: "warning" },
];

const DOCUMENTS_TO_CARRY = [
  { name: "EPIC Voter ID Card", status: "required" },
  { name: "Voter Slip (Optional)", status: "optional" },
  { name: "Alternate ID (Aadhaar, Passport) if EPIC is lost", status: "alternate" },
];

export default function PollingDayPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [showVVPAT, setShowVVPAT] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);

  const handleVote = (candidateId) => {
    setSelectedCandidate(candidateId);
  };

  const confirmVote = () => {
    if (!selectedCandidate) return;
    setVoteConfirmed(true);
    setShowVVPAT(true);
    setTimeout(() => {
      setCurrentStage(4);
    }, 2000);
  };

  const resetSimulation = () => {
    setSelectedCandidate(null);
    setVoteConfirmed(false);
    setShowVVPAT(false);
    setCurrentStage(3);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream to-white py-12 sm:py-16" aria-labelledby="polling-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="polling-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-4">Polling Day Simulator</h1>
          <p className="text-text-secondary max-w-2xl text-lg">
            Experience the complete voting journey before you step into the booth. Master the EVM, understand the VVPAT, and prepare for a seamless democratic act.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - What to Carry */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-5">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                <span aria-hidden="true">📋</span> What to Carry
              </h3>
              <ul className="space-y-3" role="list">
                {DOCUMENTS_TO_CARRY.map((doc) => (
                  <li key={doc.name} className={`p-3 rounded-lg ${
                    doc.status === "required" ? "bg-green-50" :
                    doc.status === "optional" ? "bg-green-50" : "bg-blue-50"
                  }`}>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5" aria-hidden="true">
                        {doc.status === "required" ? "✅" : doc.status === "optional" ? "✅" : "ℹ️"}
                      </span>
                      <p className="text-sm font-medium text-navy">{doc.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Errors */}
            <div className="card p-5">
              <h3 className="font-bold text-danger mb-4 flex items-center gap-2">
                <span aria-hidden="true">⚠️</span> Common Errors
              </h3>
              <ul className="space-y-3" role="list">
                {COMMON_ERRORS.map((err) => (
                  <li key={err.title} className={`p-3 rounded-lg ${
                    err.severity === "danger" ? "bg-red-50 border border-red-200" : "bg-amber-50 border border-amber-200"
                  }`}>
                    <p className={`text-sm font-bold ${err.severity === "danger" ? "text-danger" : "text-amber-700"}`}>{err.title}</p>
                    <p className="text-xs text-text-secondary mt-1">{err.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main EVM Simulator */}
          <div className="lg:col-span-3">
            {/* Stage Bar */}
            <div className="card p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="badge badge-navy text-xs">Stage {currentStage} of 5</span>
                  <h2 className="font-bold text-navy text-sm">{BOOTH_STAGES[currentStage - 1].title}</h2>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-success">
                  <span className="status-dot status-dot-live" aria-hidden="true"></span>
                  Live Simulation
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${(currentStage / 5) * 100}%` }} role="progressbar" aria-valuenow={currentStage} aria-valuemin={0} aria-valuemax={5} />
              </div>
            </div>

            {/* EVM Machine */}
            <div className="card p-6 sm:p-8" aria-labelledby="evm-heading">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 id="evm-heading" className="text-xl font-bold text-success">Ballot Unit</h2>
                  <p className="text-sm text-text-secondary">Select your candidate in 3D</p>
                </div>
                <span className="w-4 h-4 rounded-full bg-success" aria-label="EVM active" aria-hidden="true"></span>
              </div>

              {/* 3D EVM Integration */}
              <div className="mb-8">
                <EVMMachine onVote={handleVote} selectedCandidate={selectedCandidate} />
              </div>

              {/* Candidates List */}
              <div className="space-y-3 mb-6" role="radiogroup" aria-label="Candidate selection">
                {CANDIDATES.map((candidate) => (
                  <button
                    key={candidate.id}
                    onClick={() => handleVote(candidate.id)}
                    disabled={voteConfirmed}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedCandidate === candidate.id
                        ? "border-saffron bg-saffron/5 shadow-md"
                        : "border-border-light hover:border-border bg-white"
                    } disabled:cursor-default`}
                    role="radio"
                    aria-checked={selectedCandidate === candidate.id}
                    id={`candidate-${candidate.id}`}
                  >
                    <span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-sm font-bold text-text-muted shrink-0">
                      {String(candidate.id).padStart(2, "0")}
                    </span>
                    <span className={`w-8 h-8 rounded-full ${candidate.color} flex items-center justify-center text-white text-sm`} aria-hidden="true">
                      {candidate.icon}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-navy">{candidate.name}</p>
                      <p className="text-xs text-text-muted">{candidate.party}</p>
                    </div>
                    <div className="h-0.5 w-16 bg-cream-dark rounded" aria-hidden="true"></div>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedCandidate === candidate.id
                        ? "bg-saffron border-saffron"
                        : "bg-navy-light border-navy-light"
                    }`}>
                      {selectedCandidate === candidate.id && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Confirm / VVPAT */}
              {selectedCandidate && !voteConfirmed && (
                <div className="text-center animate-fade-in">
                  <button onClick={confirmVote} className="btn-primary px-8 py-3 text-base" id="confirm-vote">
                    Confirm & Cast Vote 🗳️
                  </button>
                  <p className="text-xs text-text-muted mt-2">Press firmly until you hear the beep</p>
                </div>
              )}

              {showVVPAT && (
                <div className="mt-6 animate-fade-in-up">
                  <div className="bg-green-50 border-2 border-success rounded-xl p-6 text-center">
                    <p className="text-3xl mb-2" aria-hidden="true">✅</p>
                    <h3 className="text-lg font-bold text-green-india">VVPAT Slip Printed!</h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {CANDIDATES.find((c) => c.id === selectedCandidate)?.name} — {CANDIDATES.find((c) => c.id === selectedCandidate)?.party}
                    </p>
                    <p className="text-xs text-text-muted mt-3">The slip is visible for 7 seconds through the transparent window</p>
                    <div className="mt-4 flex justify-center gap-3">
                      <button onClick={resetSimulation} className="btn-secondary text-sm">Reset Simulation</button>
                      <Link href="/live-results" className="btn-primary text-sm">View Results →</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Navigation */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStage(Math.max(1, currentStage - 1))}
                className="btn-secondary text-sm"
                disabled={currentStage === 1}
              >
                ← Previous: {currentStage > 1 ? BOOTH_STAGES[currentStage - 2].title : ""}
              </button>
              <button
                onClick={() => { setCurrentStage(Math.min(5, currentStage + 1)); }}
                className="btn-primary text-sm"
                disabled={currentStage === 5}
                id="next-stage"
              >
                Next: {currentStage < 5 ? BOOTH_STAGES[currentStage].title : "Complete"} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
