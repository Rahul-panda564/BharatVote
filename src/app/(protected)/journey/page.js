"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const DOCUMENTS = [
  { name: "EPIC Voter ID Card", required: true, checked: true },
  { name: "Aadhaar Card", required: true, checked: true },
  { name: "Voter Slip", required: false, checked: false },
];

const FORM_STEPS = [
  { id: 1, title: "Identity", icon: "👤" },
  { id: 2, title: "Address", icon: "📍" },
  { id: 3, title: "Verification", icon: "📄" },
  { id: 4, title: "Submit", icon: "✅" },
];

export default function JourneyPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [formType, setFormType] = useState("6");
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    dob: "",
    gender: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
    idType: "",
    idNumber: "",
    agree: false,
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const [verificationSteps, setVerificationSteps] = useState([
    { title: "Application Submitted", status: "pending", date: "—" },
    { title: "BLO Assigned", status: "pending", date: "—" },
    { title: "Field Verification", status: "pending", date: "—" },
    { title: "EPIC Generated", status: "pending", date: "—" },
  ]);

  useEffect(() => {
    if (!user) {
      setDataLoading(false);
      return;
    }

    const forceLoad = setTimeout(() => {
      setDataLoading(false);
    }, 2500);

    const loadData = async () => {
      try {
        const docRef = doc(db, "registrations", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({ ...prev, ...data }));
          if (data.status === "submitted") {
            setIsSubmitted(true);
            setVerificationSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: "completed", date: "Verified" } : s));
          } else if (data.currentStep) {
            setCurrentStep(data.currentStep);
          }
        }
      } catch (err) { 
        console.warn("Sync slow, using local session.");
      } finally {
        clearTimeout(forceLoad);
        setDataLoading(false);
      }
    };
    loadData();
    return () => clearTimeout(forceLoad);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName) return "Full Name is required.";
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(formData.fullName)) {
        return "Invalid Name: Please use only letters and spaces.";
      }
      if (!formData.dob) return "Date of Birth is required.";
    }
    if (currentStep === 2) {
      if (!formData.address) return "Residential Address is required.";
      if (!formData.pincode) return "PIN Code is required.";
    }
    if (currentStep === 3) {
      if (!formData.idType) return "Document Type is required.";
      if (!formData.idNumber) return "ID Number is required.";
      if (formData.idType === "AADHAAR") {
        const aadhaarRegex = /^\d{12}$/;
        if (!aadhaarRegex.test(formData.idNumber.replace(/\s/g, ""))) {
          return "Invalid Aadhaar: Must be exactly 12 digits.";
        }
      }
      if (!uploadedFile) return "Please upload a document scan.";
    }
    return null;
  };

  const nextStep = async () => {
    const errorMsg = validateStep();
    if (errorMsg) {
      setSaveStatus(errorMsg);
      return;
    }
    setSaveStatus("");

    // Auto-save progress to Firestore on every "Continue"
    if (user) {
      setLoading(true);
      try {
        const nextIdx = currentStep === 4 ? 4 : currentStep + 1;
        await setDoc(doc(db, "registrations", user.uid), { 
          ...formData, 
          currentStep: nextIdx,
          updatedAt: serverTimestamp() 
        }, { merge: true });
      } catch (err) { 
        console.error("Auto-save failed:", err);
      } finally {
        setLoading(false);
      }
    }

    if (currentStep === 4) {
      setLoading(true);
      try {
        await setDoc(doc(db, "registrations", user.uid), { ...formData, status: "submitted", formType, updatedAt: serverTimestamp() });
        setIsSubmitted(true);
        setSaveStatus("Registration Simulated Successfully!");
        setVerificationSteps(prev => prev.map((s, i) => i === 0 ? { ...s, status: "completed", date: "Just now" } : s));
      } catch (err) { setSaveStatus("Error saving."); }
      finally { setLoading(false); }
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Compact Header with Master Stepper */}
      <div className="bg-navy text-white pt-10 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tighter">Electoral Journey <span className="text-saffron">Dashboard</span></h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium opacity-80">
            Complete your registration, track verification milestones, and master your civic duties in real-time.
          </p>

          {/* Form Type Selector */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
             <button 
              onClick={() => setFormType("6")}
              className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${formType === "6" ? "bg-saffron text-white shadow-lg shadow-saffron/20" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"}`}
             >
                NEW REGISTRATION (FORM 6)
             </button>
             <button 
              onClick={() => {
                if(isSubmitted) {
                  setFormType("8");
                } else {
                  alert("Please complete your initial registration (Form 6) before requesting corrections.");
                }
              }}
              className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 ${
                formType === "8" ? "bg-saffron text-white shadow-lg shadow-saffron/20" : 
                !isSubmitted ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" :
                "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
              }`}
             >
                {!isSubmitted && <span className="opacity-50">🔒</span>}
                CORRECTION OF ENTRIES (FORM 8)
             </button>
          </div>

          {/* Master 7-Stage Stepper */}
          <div className="hidden md:block max-w-4xl mx-auto pb-4">
            <div className="relative flex justify-between items-center">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10" aria-hidden="true"></div>
              
              {[
                { id: 1, name: "Registration", icon: "📝", isCompleted: formData.status === "submitted", isCurrent: !formData.status },
                { id: 2, name: "Verification", icon: "🔍", isCompleted: false, isCurrent: formData.status === "submitted" },
                { id: 3, name: "Education", icon: "📚", isCompleted: false, isCurrent: false },
                { id: 4, name: "Booth Finder", icon: "📍", isCompleted: false, isCurrent: false },
                { id: 5, name: "Candidates", icon: "👤", isCompleted: false, isCurrent: false },
                { id: 6, name: "Polling Day", icon: "🗳️", isCompleted: false, isCurrent: false },
                { id: 7, name: "Grievance", icon: "⚖️", isCompleted: false, isCurrent: false },
              ].map((stage) => (
                <div key={stage.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm transition-all duration-300 ${
                    stage.isCompleted ? "bg-success text-white ring-2 ring-success/50" : 
                    stage.isCurrent ? "bg-saffron text-white ring-4 ring-saffron/30 animate-pulse" : 
                    "bg-navy-light text-white/40 border border-white/10"
                  }`}>
                    {stage.isCompleted ? "✓" : stage.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap transition-colors ${
                    stage.isCompleted ? "text-success" : 
                    stage.isCurrent ? "text-saffron" : 
                    "text-white/40"
                  }`}>
                    {stage.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-20 -mt-24 pb-20">
        {dataLoading ? (
          <div className="card p-20 text-center bg-white shadow-xl">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-navy font-bold">Synchronizing Journey Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Console */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Form & Stepper */}
            <div className="card shadow-xl overflow-hidden border-0">
              <div className="bg-white p-6 sm:p-10 pb-0">
                <div className="relative flex justify-between items-center max-w-2xl mx-auto mb-10 mt-4">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full" aria-hidden="true"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-saffron rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${(currentStep - 1) * 100 / (FORM_STEPS.length - 1)}%` }}
                  ></div>
                  
                  {FORM_STEPS.map((s) => {
                    const isCompleted = currentStep > s.id;
                    const isActive = currentStep === s.id;
                    
                    return (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl shadow-sm transition-all duration-300 ${
                          isCompleted ? "bg-success text-white ring-4 ring-green-50" : 
                          isActive ? "bg-saffron text-white ring-4 ring-saffron/20 animate-pulse" : 
                          "bg-white text-text-muted border-2 border-border"
                        }`}>
                          {isCompleted ? "✓" : s.icon}
                        </div>
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap transition-colors ${
                          isCompleted ? "text-success" : 
                          isActive ? "text-saffron" : 
                          "text-text-muted"
                        }`}>
                          {s.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 sm:p-10 bg-white">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-navy">
                    {currentStep === 4 ? "Review & Confirm" : `Step ${currentStep}: ${FORM_STEPS[currentStep-1].title}`}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-navy opacity-40 uppercase">Mode:</span>
                    <span className="text-[10px] font-black bg-navy text-white px-3 py-1 rounded-full uppercase">
                      Form {formType} {formType === "6" ? "(Registration)" : "(Correction)"}
                    </span>
                  </div>
                </div>

                {saveStatus && currentStep !== 4 && (
                  <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-lg mb-6 flex items-center gap-2 animate-fade-in border border-red-100">
                    <span>⚠️</span> {saveStatus}
                  </div>
                )}

                {isSubmitted ? (
                  <div className="text-center py-10 animate-fade-in-up">
                    <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                      ✓
                    </div>
                    <h2 className="text-2xl font-black text-navy mb-3">Submission Successful!</h2>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                      Your Form {formType} has been submitted to the ECI portal simulation. You can now track its status in the Live Tracker.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/learn" className="btn-primary">
                        Start Learning Stage ➔
                      </Link>
                      <Link href="/profile" className="btn-secondary">
                        View My ID Card
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="min-h-[300px]">
                      {currentStep === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Full Name *</label>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="Entry Name" />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">DOB *</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input-field" />
                          </div>
                          <div className="col-span-1">
                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Gender *</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                              <option value="">Select</option>
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-6 animate-fade-in">
                          <div>
                            <label className="block text-xs font-bold text-text-muted uppercase mb-2">Residential Address *</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} className="input-field h-24" placeholder="Full house details..." />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-text-muted uppercase mb-2">State</label>
                              <select name="state" value={formData.state} onChange={handleChange} className="input-field">
                                <option value="">Choose State/UT</option>
                                <option value="AN">Andaman and Nicobar Islands</option>
                                <option value="AP">Andhra Pradesh</option>
                                <option value="AR">Arunachal Pradesh</option>
                                <option value="AS">Assam</option>
                                <option value="BR">Bihar</option>
                                <option value="CH">Chandigarh</option>
                                <option value="CT">Chhattisgarh</option>
                                <option value="DN">Dadra and Nagar Haveli and Daman and Diu</option>
                                <option value="DL">Delhi</option>
                                <option value="GA">Goa</option>
                                <option value="GJ">Gujarat</option>
                                <option value="HR">Haryana</option>
                                <option value="HP">Himachal Pradesh</option>
                                <option value="JK">Jammu and Kashmir</option>
                                <option value="JH">Jharkhand</option>
                                <option value="KA">Karnataka</option>
                                <option value="KL">Kerala</option>
                                <option value="LA">Ladakh</option>
                                <option value="LD">Lakshadweep</option>
                                <option value="MP">Madhya Pradesh</option>
                                <option value="MH">Maharashtra</option>
                                <option value="MN">Manipur</option>
                                <option value="ML">Meghalaya</option>
                                <option value="MZ">Mizoram</option>
                                <option value="NL">Nagaland</option>
                                <option value="OR">Odisha</option>
                                <option value="PY">Puducherry</option>
                                <option value="PB">Punjab</option>
                                <option value="RJ">Rajasthan</option>
                                <option value="SK">Sikkim</option>
                                <option value="TN">Tamil Nadu</option>
                                <option value="TG">Telangana</option>
                                <option value="TR">Tripura</option>
                                <option value="UP">Uttar Pradesh</option>
                                <option value="UT">Uttarakhand</option>
                                <option value="WB">West Bengal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-text-muted uppercase mb-2">PIN Code *</label>
                              <input name="pincode" value={formData.pincode} onChange={handleChange} className="input-field" maxLength={6} placeholder="6-digit PIN" />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-8 animate-fade-in">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-xs font-bold text-text-muted uppercase mb-2">Document Type *</label>
                              <select name="idType" value={formData.idType} onChange={handleChange} className="input-field">
                                <option value="">Select Document</option>
                                <option value="AADHAAR">Aadhaar Card</option>
                                <option value="PASSPORT">Passport</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-text-muted uppercase mb-2">ID Number *</label>
                              <input name="idNumber" value={formData.idNumber} onChange={handleChange} className="input-field" placeholder="Enter number" />
                            </div>
                          </div>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              onChange={(e) => setUploadedFile(e.target.files[0])}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <div 
                              className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${uploadedFile ? "bg-green-50 border-success" : "bg-gray-50 border-gray-200 hover:border-saffron"}`}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <span className="text-4xl block mb-2">{uploadedFile ? "📄" : "📸"}</span>
                              <p className={`text-sm font-bold ${uploadedFile ? "text-success" : "text-navy"}`}>
                                {uploadedFile ? uploadedFile.name : "Upload Document Scans"}
                              </p>
                              <p className="text-xs text-text-muted mt-1">
                                {uploadedFile ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB` : "PDF, JPG up to 5MB"}
                              </p>
                              {uploadedFile && <p className="text-[10px] text-success font-bold mt-2">CLICK TO CHANGE</p>}
                            </div>
                          </div>
                      )}

                      {currentStep === 4 && (
                        <div className="animate-fade-in">
                          <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex items-start gap-4">
                            <span className="text-2xl mt-1">📝</span>
                            <div>
                              <h3 className="font-bold text-green-900">Final Declaration</h3>
                              <p className="text-xs text-green-800/80 mb-4 mt-1 leading-relaxed">
                                I certify that I am a citizen of India and all details provided are correct.
                              </p>
                              <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} className="w-5 h-5 rounded border-green-300 accent-green-600" />
                                <span className="text-sm font-bold text-green-900">I Agree to the Declaration</span>
                              </label>
                            </div>
                          </div>
                          
                          {saveStatus && !saveStatus.includes("Successfully") && (
                            <div className="mt-6 p-4 rounded-xl text-sm font-bold text-center bg-red-50 text-red-600">
                              <span>⚠️</span> {saveStatus}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-10 pt-8 border-t">
                      <button 
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1 || loading}
                        className="px-6 py-2.5 rounded-xl font-bold text-navy hover:bg-cream disabled:opacity-30"
                      >
                        Back
                      </button>
                      <button 
                        onClick={nextStep}
                        disabled={loading || (currentStep === 4 && !formData.agree)}
                        className="px-10 py-3 rounded-xl bg-navy text-white font-bold hover:bg-navy-dark shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? "Processing..." : currentStep === 4 ? "Complete Submission" : "Continue"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Empty Space fix: Useful Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 border-0 shadow-sm bg-white">
                <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                  <span className="text-xl">💡</span> Quick Help
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <span className="text-saffron font-bold text-lg leading-none">1.</span>
                    <p className="text-xs text-text-secondary">Keep your 12-digit Aadhaar number ready for instant verification.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-saffron font-bold text-lg leading-none">2.</span>
                    <p className="text-xs text-text-secondary">Ensure your address matches the proof document exactly.</p>
                  </li>
                </ul>
              </div>
              <div className="card p-6 border-0 shadow-sm bg-white">
                <h3 className="font-bold text-navy mb-4 flex items-center gap-2">
                   <span className="text-xl">🛡️</span> Security Note
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your data is encrypted and synced with your BharatVote profile. We only use this for simulation and educational purposes.
                </p>
                <Link href="/help" className="text-xs font-bold text-navy mt-4 inline-block underline">
                  Privacy Policy & Data Handling
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Status & Roadmap */}
          <div className="space-y-6">
            {/* Real-time Status */}
            <div className="card p-6 border-0 shadow-xl bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-navy flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                  Live Tracker
                </h3>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${formData.status === "submitted" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {formData.status === "submitted" ? "Active" : "No Application"}
                </span>
              </div>
              
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                {verificationSteps.map((s) => (
                  <div key={s.title} className="flex gap-4 relative animate-fade-in">
                    <div className={`w-6 h-6 rounded-full border-4 flex items-center justify-center shrink-0 z-10 transition-colors ${s.status === "completed" ? "bg-green-500 border-green-100" : "bg-white border-gray-200"}`}>
                      {s.status === "completed" && <span className="text-[10px] text-white">✓</span>}
                    </div>
                    <div>
                      <p className={`text-xs font-bold transition-colors ${s.status === "completed" ? "text-green-600" : "text-navy"}`}>{s.title}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{s.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!formData.status && (
                <div className="mt-8 pt-6 border-t text-center">
                  <p className="text-[10px] text-text-muted italic">Complete the form to start<br />real-time tracking</p>
                </div>
              )}
            </div>

            {/* Global Stages - Integrated here */}
            <div className="card p-6 border-0 shadow-xl bg-navy text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
              <h3 className="font-bold mb-6 flex items-center gap-2 relative z-10">
                <span className="text-lg">🗺️</span> Election Roadmap
              </h3>
              <div className="space-y-4 relative z-10">
                 {[
                  { n: 1, t: "Registration", h: "/journey", status: isSubmitted ? "completed" : "current" },
                  { n: 2, t: "Verification", h: "/journey", status: isSubmitted ? "current" : "locked" },
                  { n: 3, t: "Education", h: "/learn", status: "available" },
                  { n: 4, t: "Booth Finder", h: "/journey", status: isSubmitted ? "available" : "locked" },
                  { n: 5, t: "Candidates", h: "/representation", status: "available" },
                  { n: 6, t: "Polling Day", h: "/polling-day", status: "available" },
                  { n: 7, t: "Grievance", h: "/grievance", status: "available" },
                ].map((s) => (
                  <div key={s.n} className="group">
                    {s.status === "locked" ? (
                      <div className="flex items-center gap-3 opacity-40 cursor-not-allowed">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-white/10 text-white/40">
                          🔒
                        </span>
                        <span className="text-[11px] font-semibold text-white/40">{s.t}</span>
                      </div>
                    ) : (
                      <Link 
                        href={s.h}
                        className={`flex items-center gap-3 transition-all ${s.status === "current" ? "opacity-100" : s.status === "completed" ? "opacity-100" : "opacity-80 hover:opacity-100 hover:translate-x-1"}`}
                      >
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold ${
                            s.status === "current" ? "bg-saffron text-white shadow-md" : 
                            s.status === "completed" ? "bg-success text-white" :
                            "bg-white opacity-20 text-white hover:opacity-30 transition-colors"
                          }`}>
                          {s.status === "completed" ? "✓" : s.n}
                        </span>
                        <span className={`text-[12px] font-semibold ${s.status === "current" ? "text-saffron" : "text-white"}`}>{s.t}</span>
                        {s.status === "current" && <div className="ml-auto w-2 h-2 rounded-full bg-saffron animate-pulse" />}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="px-4">
              <Link href="/chunav-mitra" className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-border-light hover:shadow-md transition-all">
                <span className="text-2xl">🤖</span>
                <div>
                  <p className="text-xs font-bold text-navy leading-none">Chunav Mitra</p>
                  <p className="text-[10px] text-text-muted mt-1">Get AI assistance</p>
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
