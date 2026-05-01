"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const STAGES = [
  { id: 1, name: "Registration", icon: "📝", color: "bg-saffron" },
  { id: 2, name: "Verification", icon: "🔍", color: "bg-blue-600" },
  { id: 3, name: "Education", icon: "📚", color: "bg-green-600" },
  { id: 4, name: "Booth Finder", icon: "📍", color: "bg-purple-600" },
  { id: 5, name: "Candidates", icon: "👤", color: "bg-amber-600" },
  { id: 6, name: "Polling Day", icon: "🗳️", color: "bg-indigo-600" },
  { id: 7, name: "Grievance", icon: "⚖️", color: "bg-teal-600" },
];

export default function JourneyPage() {
  const { user } = useAuth();
  const [stage, setStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [journeyComplete, setJourneyComplete] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "", dob: "", address: "", state: "", pincode: "",
    idType: "", idNumber: "", educationAnswer: "",
    boothLocation: "", candidateChoice: "", evmConfirm: false,
    grievanceText: "",
  });
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!user) { setDataLoading(false); return; }
    const timeout = setTimeout(() => setDataLoading(false), 2000);
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "registrations", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setForm(prev => ({ ...prev, ...d }));
          if (d.journeyStage) setStage(Math.min(d.journeyStage, 7));
          if (d.journeyComplete) setJourneyComplete(true);
        }
      } catch (e) { console.warn("Sync slow"); }
      finally { clearTimeout(timeout); setDataLoading(false); }
    };
    load();
    return () => clearTimeout(timeout);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    switch (stage) {
      case 1:
        if (!form.fullName) return "Full Name is required.";
        if (!form.dob) return "Date of Birth is required.";
        if (!form.address) return "Address is required.";
        if (!form.pincode) return "PIN Code is required.";
        return null;
      case 2:
        if (!form.idType) return "Document Type is required.";
        if (!form.idNumber) return "ID Number is required.";
        if (!uploadedFile) return "Please upload a document.";
        return null;
      case 3:
        if (!form.educationAnswer) return "Please answer the question.";
        return null;
      case 4:
        if (!form.boothLocation) return "Please enter your booth area.";
        return null;
      case 5:
        if (!form.candidateChoice) return "Please select a candidate.";
        return null;
      case 6:
        if (!form.evmConfirm) return "Please confirm EVM practice.";
        return null;
      case 7:
        if (!form.grievanceText) return "Please describe your grievance.";
        return null;
      default: return null;
    }
  };

  const nextStage = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    // Save progress
    if (user) {
      setDoc(doc(db, "registrations", user.uid), {
        ...form, journeyStage: stage + 1,
        journeyComplete: stage === 7,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(() => {});
    }

    const stageName = STAGES[stage - 1].name;
    setSuccessMsg(`${stageName} Completed Successfully!`);

    setTimeout(() => {
      if (stage === 7) {
        setJourneyComplete(true);
      } else {
        setStage(s => s + 1);
      }
      setSuccessMsg("");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1500);
  };

  const stageContent = () => {
    switch (stage) {
      case 1: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">📝 Stage 1: Voter Registration</h3>
          <p className="text-xs text-text-secondary">Fill in your identity and address details to register as a voter.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">Full Name *</label>
              <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">Date of Birth *</label>
              <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Residential Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange} className="input-field h-20" placeholder="Full address..." />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">State</label>
              <input name="state" value={form.state} onChange={handleChange} className="input-field" placeholder="e.g. Odisha" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">PIN Code *</label>
              <input name="pincode" value={form.pincode} onChange={handleChange} className="input-field" maxLength={6} placeholder="6-digit PIN" />
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">🔍 Stage 2: Document Verification</h3>
          <p className="text-xs text-text-secondary">Upload your identity document for BLO verification.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">Document Type *</label>
              <select name="idType" value={form.idType} onChange={handleChange} className="input-field">
                <option value="">Select</option>
                <option value="AADHAAR">Aadhaar Card</option>
                <option value="PASSPORT">Passport</option>
                <option value="DL">Driving License</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-2">ID Number *</label>
              <input name="idNumber" value={form.idNumber} onChange={handleChange} className="input-field" placeholder="Enter number" />
            </div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setUploadedFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png" />
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploadedFile ? "bg-green-50 border-success" : "bg-gray-50 border-gray-200 hover:border-saffron"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="text-3xl block mb-2">{uploadedFile ? "📄" : "📸"}</span>
            <p className={`text-sm font-bold ${uploadedFile ? "text-success" : "text-navy"}`}>
              {uploadedFile ? uploadedFile.name : "Upload Document Scan"}
            </p>
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">📚 Stage 3: Election Education</h3>
          <p className="text-xs text-text-secondary">Test your knowledge about the Indian electoral process.</p>
          <div className="bg-cream rounded-2xl p-6 border border-navy/5">
            <p className="font-bold text-navy mb-4">What is the minimum voting age in India?</p>
            <div className="space-y-3">
              {["16 years", "18 years", "21 years", "25 years"].map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${form.educationAnswer === opt ? "bg-saffron/10 border-saffron" : "bg-white border-gray-100 hover:border-saffron/50"}`}>
                  <input type="radio" name="educationAnswer" value={opt} checked={form.educationAnswer === opt} onChange={handleChange} className="accent-saffron" />
                  <span className="text-sm font-semibold text-navy">{opt}</span>
                  {form.educationAnswer === opt && opt === "18 years" && <span className="ml-auto text-success text-xs font-bold">✓ Correct!</span>}
                </label>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs text-blue-800 font-semibold">💡 Did you know? Article 326 of the Indian Constitution guarantees universal adult suffrage for citizens aged 18 and above.</p>
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">📍 Stage 4: Booth Finder</h3>
          <p className="text-xs text-text-secondary">Locate your nearest polling station.</p>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Your Area / Locality *</label>
            <input name="boothLocation" value={form.boothLocation} onChange={handleChange} className="input-field" placeholder="e.g. Bhubaneswar, Ward 15" />
          </div>
          {form.boothLocation && (
            <div className="bg-cream rounded-2xl p-6 border border-navy/5 animate-fade-in">
              <h4 className="font-bold text-navy mb-3">📌 Nearest Polling Station</h4>
              <div className="space-y-2 text-xs">
                <p><span className="font-bold text-navy">Station:</span> Government High School, {form.boothLocation}</p>
                <p><span className="font-bold text-navy">Booth No:</span> #{Math.floor(Math.random() * 200 + 100)}</p>
                <p><span className="font-bold text-navy">Distance:</span> ~1.2 km from your registered address</p>
                <p><span className="font-bold text-navy">Facilities:</span> Ramp Access, Drinking Water, Shade</p>
              </div>
            </div>
          )}
        </div>
      );
      case 5: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">👤 Stage 5: Know Your Candidates</h3>
          <p className="text-xs text-text-secondary">Review and select your preferred representative.</p>
          <div className="space-y-3">
            {[
              { name: "Rajesh Kumar", party: "National Democratic Front", symbol: "🪷" },
              { name: "Priya Sharma", party: "People's Progressive Alliance", symbol: "✋" },
              { name: "Amit Patel", party: "Independent", symbol: "⭐" },
            ].map(c => (
              <label key={c.name} className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${form.candidateChoice === c.name ? "bg-saffron/10 border-saffron shadow-md" : "bg-white border-gray-100 hover:border-saffron/50"}`}>
                <input type="radio" name="candidateChoice" value={c.name} checked={form.candidateChoice === c.name} onChange={handleChange} className="accent-saffron" />
                <span className="text-2xl">{c.symbol}</span>
                <div>
                  <p className="text-sm font-bold text-navy">{c.name}</p>
                  <p className="text-[10px] text-text-muted">{c.party}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      );
      case 6: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">🗳️ Stage 6: Polling Day Simulation</h3>
          <p className="text-xs text-text-secondary">Practice the voting process on our EVM simulator.</p>
          <div className="bg-navy rounded-2xl p-6 text-white text-center">
            <p className="text-xs opacity-60 mb-3 uppercase tracking-widest font-bold">EVM Simulator</p>
            <div className="space-y-3 max-w-xs mx-auto text-left">
              {["Rajesh Kumar 🪷", "Priya Sharma ✋", "Amit Patel ⭐", "NOTA ✖️"].map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all cursor-pointer">
                  <span className="text-sm font-semibold">{c}</span>
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/50" />
                </div>
              ))}
            </div>
            <div className="mt-6 bg-white/10 rounded-xl p-4">
              <p className="text-[10px] text-white/60 mb-2">VVPAT Slip Preview</p>
              <p className="text-sm font-bold text-saffron">{form.candidateChoice || "—"}</p>
            </div>
          </div>
          <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 cursor-pointer hover:bg-cream transition-all">
            <input type="checkbox" name="evmConfirm" checked={form.evmConfirm} onChange={handleChange} className="w-5 h-5 accent-navy" />
            <span className="text-xs font-bold text-navy">I have practiced and understand the EVM/VVPAT voting process.</span>
          </label>
        </div>
      );
      case 7: return (
        <div className="space-y-6 animate-fade-in">
          <h3 className="text-lg font-black text-navy flex items-center gap-2">⚖️ Stage 7: Grievance Portal</h3>
          <p className="text-xs text-text-secondary">File a complaint or provide feedback about the electoral process.</p>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Describe your grievance or feedback *</label>
            <textarea name="grievanceText" value={form.grievanceText} onChange={handleChange} className="input-field h-32" placeholder="Describe any issue you faced during the electoral process, or share your feedback..." />
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <p className="text-xs text-amber-800 font-semibold">⚖️ Your grievance will be simulated as an RTI/complaint to the Election Commission. In real life, you can file at <strong>eci.gov.in</strong></p>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <div className="bg-navy text-white pt-10 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tighter">Electoral Journey <span className="text-saffron">Dashboard</span></h1>
          <p className="text-blue-200 text-sm max-w-xl mx-auto mb-10 font-medium opacity-80">
            Complete all 7 stages of your democratic journey — from registration to grievance redressal.
          </p>

          {/* 7-Stage Master Stepper */}
          <div className="hidden md:block max-w-4xl mx-auto pb-4">
            <div className="relative flex justify-between items-center">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-saffron transition-all duration-700" style={{ width: `${journeyComplete ? 100 : ((stage - 1) / 6) * 100}%` }} />
              {STAGES.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all duration-300 ${
                    s.id < stage || journeyComplete ? "bg-success text-white ring-2 ring-success/50" :
                    s.id === stage ? "bg-saffron text-white ring-4 ring-saffron/30 animate-pulse" :
                    "bg-navy-light text-white/40 border border-white/10"
                  }`}>
                    {s.id < stage || journeyComplete ? "✓" : s.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap ${
                    s.id < stage || journeyComplete ? "text-success" : s.id === stage ? "text-saffron" : "text-white/40"
                  }`}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-24 pb-20">
        {dataLoading ? (
          <div className="card p-20 text-center bg-white shadow-xl">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-navy font-bold">Synchronizing Journey Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Panel */}
            <div className="lg:col-span-3">
              <div className="card shadow-xl overflow-hidden border-0 bg-white">
                <div className="p-6 sm:p-10">
                  {/* Mobile stage indicator */}
                  <div className="md:hidden mb-6">
                    <span className="text-[10px] font-black text-saffron uppercase tracking-widest">
                      {journeyComplete ? "All 7 Stages Complete ✓" : `Stage ${stage} of 7`}
                    </span>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                      <div className="h-2 bg-saffron rounded-full transition-all duration-500" style={{ width: `${journeyComplete ? 100 : (stage / 7) * 100}%` }} />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-6 flex items-center gap-2 border border-red-100">
                      <span>⚠️</span> {error}
                    </div>
                  )}

                  {/* Success transition message */}
                  {successMsg ? (
                    <div className="text-center py-16 animate-fade-in">
                      <div className="w-16 h-16 bg-green-50 text-success rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-green-100">✓</div>
                      <h3 className="text-xl font-black text-navy mb-2">{successMsg}</h3>
                      <p className="text-xs text-text-secondary">{stage < 7 ? `Moving to ${STAGES[stage].name}...` : "Completing your journey..."}</p>
                    </div>

                  ) : journeyComplete ? (
                    <div className="animate-fade-in-up space-y-8">
                      {/* Hero Banner */}
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-4xl mx-auto mb-4">🎉</div>
                        <h2 className="text-2xl font-black text-navy mb-2">Electoral Journey Complete!</h2>
                        <p className="text-xs text-text-secondary max-w-md mx-auto">You have successfully completed all 7 stages. Your vote has been recorded in the simulation.</p>
                      </div>

                      {/* Vote Summary Card */}
                      <div className="bg-cream rounded-2xl p-6 border border-navy/5">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2 text-sm">🗳️ Your Vote Summary</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">Elector</p>
                            <p className="font-black text-navy">{form.fullName || "—"}</p>
                          </div>
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">State</p>
                            <p className="font-black text-navy">{form.state || "—"}</p>
                          </div>
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">Verification</p>
                            <p className="font-black text-success">✓ {form.idType || "Verified"}</p>
                          </div>
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">Booth</p>
                            <p className="font-black text-navy">{form.boothLocation || "—"}</p>
                          </div>
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">Vote Cast For</p>
                            <p className="font-black text-saffron">{form.candidateChoice || "—"}</p>
                          </div>
                          <div>
                            <p className="text-text-muted uppercase font-bold text-[8px]">Status</p>
                            <p className="font-black text-success">✓ Complete</p>
                          </div>
                        </div>
                      </div>

                      {/* Completed Stages Timeline */}
                      <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h3 className="font-bold text-navy mb-4 flex items-center gap-2 text-sm">📋 Completed Stages</h3>
                        <div className="space-y-3">
                          {STAGES.map(s => (
                            <div key={s.id} className="flex items-center gap-3 p-2">
                              <span className="w-7 h-7 rounded-full bg-success text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                              <span className="text-xs font-semibold text-navy">{s.name}</span>
                              <span className="ml-auto text-[10px] text-success font-bold">Completed</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/profile" className="btn-primary text-center">View My Digital ID Card</Link>
                        <Link href="/chunav-mitra" className="btn-secondary text-center">Ask Chunav Mitra 🤖</Link>
                        <Link href="/learn" className="btn-secondary text-center">Explore Learning 📚</Link>
                      </div>
                    </div>

                  ) : (
                    <>
                      {stageContent()}
                      <div className="flex justify-between items-center mt-10 pt-8 border-t">
                        <button
                          onClick={() => { if (stage > 1) { setStage(s => s - 1); setError(""); } }}
                          disabled={stage === 1 || loading}
                          className="px-6 py-2.5 rounded-xl font-bold text-navy hover:bg-cream disabled:opacity-30"
                        >Back</button>
                        <button
                          onClick={nextStage}
                          disabled={loading}
                          className="px-10 py-3 rounded-xl bg-navy text-white font-bold hover:bg-navy-dark shadow-lg transition-all disabled:opacity-50"
                        >
                          {loading ? "Processing..." : stage === 7 ? "Complete Journey" : "Continue →"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Roadmap */}
              <div className="rounded-2xl p-6 shadow-xl overflow-hidden relative" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 pointer-events-none" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                <h3 className="font-bold mb-6 flex items-center gap-2 relative z-10" style={{ color: '#ffffff' }}>
                  <span className="text-lg">🗺️</span> Election Roadmap
                </h3>
                <div className="space-y-4 relative z-10">
                  {STAGES.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold ${
                        s.id < stage || journeyComplete ? "bg-green-500 text-white" :
                        s.id === stage && !journeyComplete ? "bg-saffron text-white shadow-md" : ""
                      }`} style={s.id >= stage && !journeyComplete && s.id !== stage ? { backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' } : {}}>
                        {s.id < stage || journeyComplete ? "✓" : s.id}
                      </span>
                      <span className="text-[12px] font-semibold" style={{ color: s.id === stage && !journeyComplete ? '#FF9933' : '#ffffff' }}>
                        {s.name}
                      </span>
                      {s.id === stage && !journeyComplete && <div className="ml-auto w-2 h-2 rounded-full bg-saffron animate-pulse" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <Link href="/chunav-mitra" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-border-light hover:shadow-md transition-all">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <p className="text-xs font-bold text-navy">Chunav Mitra</p>
                    <p className="text-[10px] text-text-muted">Get AI assistance</p>
                  </div>
                </Link>
                <Link href="/help" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-border-light hover:shadow-md transition-all">
                  <span className="text-2xl">❓</span>
                  <div>
                    <p className="text-xs font-bold text-navy">Help Center</p>
                    <p className="text-[10px] text-text-muted">FAQs & support</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
