"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const BADGES = [
  { name: "Democracy Defender", icon: "🛡️", stage: 1 },
  { name: "Verified Voter", icon: "🔍", stage: 2 },
  { name: "Quiz Master", icon: "🧠", stage: 3 },
  { name: "Booth Explorer", icon: "📍", stage: 4 },
  { name: "Informed Citizen", icon: "👤", stage: 5 },
  { name: "Polling Pro", icon: "🗳️", stage: 6 },
  { name: "RTI Champion", icon: "⚖️", stage: 7 },
];

const STAGES = [
  { id: 1, name: "Registration", icon: "📝" },
  { id: 2, name: "Verification", icon: "🔍" },
  { id: 3, name: "Education", icon: "📚" },
  { id: 4, name: "Booth Finder", icon: "📍" },
  { id: 5, name: "Candidates", icon: "👤" },
  { id: 6, name: "Polling Day", icon: "🗳️" },
  { id: 7, name: "Grievance", icon: "⚖️" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [regData, setRegData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const timeout = setTimeout(() => setLoading(false), 1000);
    const load = async () => {
      try {
        const [userSnap, regSnap] = await Promise.all([
          getDoc(doc(db, "users", user.uid)),
          getDoc(doc(db, "registrations", user.uid)),
        ]);
        if (userSnap.exists()) setProfileData(userSnap.data());
        if (regSnap.exists()) setRegData(regSnap.data());
      } catch (e) { console.warn("Sync issue."); }
      finally { clearTimeout(timeout); setLoading(false); }
    };
    load();
    return () => clearTimeout(timeout);
  }, [user]);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.target);
    const updates = {
      fullName: formData.get('fullName'),
      state: formData.get('state'),
      constituency: formData.get('constituency'),
      pincode: formData.get('pincode'),
      bio: formData.get('bio'),
    };
    try {
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
      setProfileData(prev => ({ ...prev, ...updates }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const displayName = regData?.fullName || profileData?.fullName || user?.displayName || "Citizen";
  const initials = displayName.substring(0, 2).toUpperCase();
  const location = profileData?.constituency ? `${profileData.constituency}, ${profileData.state}` : regData?.state ? `${regData.state}` : "Location Pending";
  const journeyStage = regData?.journeyStage || 1;
  const journeyComplete = regData?.journeyComplete || false;
  const completedStages = journeyComplete ? 7 : Math.max(0, journeyStage - 1);
  const civicScore = completedStages * 120 + 10;

  const Modal = ({ title, children, onClose }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md animate-fade-in">
       <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-saffron" />
          <h3 className="text-xl font-black text-navy mb-6">{title}</h3>
          {children}
          <button onClick={onClose} className="mt-8 w-full py-4 bg-cream text-navy rounded-xl font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all">Close</button>
       </div>
    </div>
  );

  return (
    <div className="bg-cream min-h-screen">
      {/* Modals */}
      {activeModal === 'Change Password' && (
        <Modal title="Security Center" onClose={() => setActiveModal(null)}>
           <div className="space-y-4">
              <input type="password" placeholder="Current Password" className="input-field" />
              <input type="password" placeholder="New Password" className="input-field" />
              <button className="btn-primary w-full mt-2" onClick={() => { alert("Password updated!"); setActiveModal(null); }}>UPDATE PASSWORD</button>
           </div>
        </Modal>
      )}
      {activeModal === 'Security Settings' && (
        <Modal title="Advanced Security" onClose={() => setActiveModal(null)}>
           <div className="space-y-4">
              <div className="p-4 bg-cream rounded-2xl flex items-center justify-between border border-navy/5">
                 <div>
                    <p className="text-sm font-black text-navy leading-none mb-1">Two-Factor (2FA)</p>
                    <p className="text-[10px] text-text-muted">SMS & Email Verification</p>
                 </div>
                 <div className="w-12 h-6 bg-success rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full ml-auto" /></div>
              </div>
              <div className="p-4 bg-cream rounded-2xl flex items-center justify-between border border-navy/5">
                 <div>
                    <p className="text-sm font-black text-navy leading-none mb-1">Biometric Lock</p>
                    <p className="text-[10px] text-text-muted">Use FaceID / Fingerprint</p>
                 </div>
                 <div className="w-12 h-6 bg-border rounded-full flex items-center px-1"><div className="w-4 h-4 bg-white rounded-full" /></div>
              </div>
              <button className="btn-primary w-full mt-4" onClick={() => { alert("Security updated!"); setActiveModal(null); }}>SAVE SETTINGS</button>
           </div>
        </Modal>
      )}
      {activeModal === 'QR' && (
        <Modal title="Secure QR Identity" onClose={() => setActiveModal(null)}>
           <div className="flex flex-col items-center py-6">
              <div className="w-56 h-56 bg-white border-2 border-navy/10 rounded-[2.5rem] p-6 shadow-2xl relative group flex items-center justify-center">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BharatVote:ID:${user?.uid || 'GUEST'}:${displayName}`} 
                    alt="Official QR Code"
                    className="w-full h-full object-contain"
                 />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white p-1 rounded-lg shadow-xl border border-navy/10 group-hover:scale-110 transition-transform">
                       <div className="w-6 h-6 bg-navy rounded flex items-center justify-center text-[8px] text-white font-black">BV</div>
                    </div>
                 </div>
              </div>
              <div className="mt-8 text-center">
                 <p className="text-xs font-black text-navy uppercase tracking-widest">{displayName}</p>
                 <p className="text-[10px] font-bold text-saffron uppercase mt-1">Verified Digital Elector</p>
              </div>
           </div>
        </Modal>
      )}
      {activeModal === 'Language' && (
        <Modal title="Language Preferences" onClose={() => setActiveModal(null)}>
           <div className="grid grid-cols-2 gap-3">
              {['Hindi', 'English', 'Odia', 'Bengali', 'Tamil', 'Telugu'].map(lang => (
                <button key={lang} onClick={() => { alert(`Language set to ${lang}`); setActiveModal(null); }} className="p-4 bg-cream rounded-xl text-xs font-black text-navy hover:bg-navy hover:text-white transition-all">
                   {lang}
                </button>
              ))}
           </div>
        </Modal>
      )}

      {/* Hero Banner */}
      <section className="bg-navy text-white pt-20 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 right-0 w-96 h-96 bg-saffron rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-saffron to-orange-600 p-1 shadow-2xl relative">
                 <div className="w-full h-full rounded-[1.8rem] bg-navy overflow-hidden flex items-center justify-center text-4xl font-black text-white group-hover:scale-95 transition-transform duration-500">
                    {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : initials}
                 </div>
                 <button 
                  onClick={() => photoInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-navy rounded-xl flex items-center justify-center shadow-xl border-2 border-navy hover:bg-saffron hover:text-white transition-all scale-0 group-hover:scale-100 z-20"
                 >📷</button>
                 <input type="file" ref={photoInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
              </div>
              <span className="absolute -top-2 -left-2 w-10 h-10 bg-success rounded-2xl flex items-center justify-center border-4 border-navy shadow-xl" title="Verified">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">{displayName}</h1>
              <p className="text-blue-200 text-sm mb-3">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                 <span className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-saffron">
                   📍 {location}
                 </span>
                 <span className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-blue-300">
                   ⭐ Civic Score: {civicScore}
                 </span>
                 {journeyComplete && (
                   <span className="px-4 py-1.5 rounded-xl bg-success/20 border border-success/30 text-xs font-black uppercase tracking-widest text-success">
                     ✓ Journey Complete
                   </span>
                 )}
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-3 rounded-2xl bg-white text-navy font-black text-xs uppercase tracking-widest shadow-xl hover:bg-saffron hover:text-white transition-all">
               {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-20">
        {loading ? (
          <div className="card p-20 text-center bg-white shadow-xl">
            <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-navy font-bold">Loading Profile...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-7 space-y-8">
            {isEditing ? (
               <form onSubmit={handleProfileUpdate} className="card p-8 border-0 shadow-2xl bg-white animate-fade-in-up">
                  <h2 className="text-xl font-black text-navy mb-8 border-b border-cream pb-4">Profile Identity</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Full Name</label>
                        <input name="fullName" className="input-field" defaultValue={displayName} />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">State</label>
                        <input name="state" className="input-field" defaultValue={profileData?.state || regData?.state || ""} placeholder="Enter State" />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Constituency</label>
                        <input name="constituency" className="input-field" placeholder="Enter Constituency" defaultValue={profileData?.constituency || ""} />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">PIN Code</label>
                        <input name="pincode" className="input-field" defaultValue={profileData?.pincode || regData?.pincode || ""} placeholder="6-digit PIN" maxLength={6} />
                     </div>
                     <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Civic Bio</label>
                        <textarea name="bio" className="input-field h-24" placeholder="Tell the community about your civic interests..." defaultValue={profileData?.bio || ""} />
                     </div>
                  </div>
                  <div className="flex gap-4 mt-10 pt-8">
                     <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl bg-cream text-navy font-black text-xs uppercase tracking-widest hover:bg-navy hover:text-white transition-all">CANCEL</button>
                     <button type="submit" className="btn-primary flex-1">UPDATE PUBLIC PROFILE</button>
                  </div>
               </form>
            ) : (
              <>
                {/* Journey Progress Card */}
                <div className="card p-8 border-0 shadow-xl bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-lg">🎖️</span>
                      Journey Progress
                    </h2>
                    <span className="text-[10px] font-black text-saffron bg-saffron/10 px-3 py-1 rounded-full">
                      {completedStages}/7 Stages
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-100 rounded-full mb-6">
                    <div className="h-3 bg-gradient-to-r from-saffron to-orange-500 rounded-full transition-all duration-700" style={{ width: `${(completedStages / 7) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between overflow-x-auto pb-2 gap-3 no-scrollbar">
                    {STAGES.map((step) => {
                      const isCompleted = journeyComplete || step.id < journeyStage;
                      const isCurrent = !journeyComplete && step.id === journeyStage;
                      return (
                        <div key={step.id} className="flex flex-col items-center gap-2 min-w-[65px]">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                            isCompleted ? "bg-success text-white shadow-lg shadow-success/20" :
                            isCurrent ? "bg-saffron text-white ring-4 ring-saffron/20 animate-pulse" :
                            "bg-cream text-navy/30"
                          }`}>
                            {isCompleted ? "✓" : step.icon}
                          </div>
                          <span className={`text-[8px] font-black uppercase text-center leading-tight ${
                            isCompleted ? "text-success" : isCurrent ? "text-saffron" : "text-navy/30"
                          }`}>{step.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vote History Card — only if journey complete */}
                {journeyComplete && (
                  <div className="card p-8 border-0 shadow-xl bg-white">
                    <h2 className="text-sm font-black text-navy uppercase tracking-widest mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-lg">🗳️</span>
                      Vote History
                    </h2>
                    <div className="bg-cream rounded-2xl p-6 border border-navy/5">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-navy/40 uppercase">General Election 2024 (Simulation)</span>
                        <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-full">✓ Vote Cast</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="text-text-muted uppercase font-bold text-[8px]">Voted For</p>
                          <p className="font-black text-saffron">{regData?.candidateChoice || "—"}</p>
                        </div>
                        <div>
                          <p className="text-text-muted uppercase font-bold text-[8px]">Booth</p>
                          <p className="font-black text-navy">{regData?.boothLocation || "—"}</p>
                        </div>
                        <div>
                          <p className="text-text-muted uppercase font-bold text-[8px]">Verification</p>
                          <p className="font-black text-success">✓ {regData?.idType || "Verified"}</p>
                        </div>
                        <div>
                          <p className="text-text-muted uppercase font-bold text-[8px]">Status</p>
                          <p className="font-black text-success">✓ Complete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Stats + Badges Combined */}
            <div className="card p-6 border-0 shadow-xl bg-white">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-black text-navy uppercase tracking-widest">Overview</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { l: "Stages", v: `${completedStages}/7`, i: "🎯" },
                  { l: "Badges", v: `${BADGES.filter(b => journeyComplete || b.stage < journeyStage).length}/${BADGES.length}`, i: "🏅" },
                  { l: "Score", v: `${civicScore}`, i: "⭐" }
                ].map(s => (
                  <div key={s.l} className="text-center p-3 bg-cream rounded-xl">
                    <span className="text-xl block">{s.i}</span>
                    <p className="text-lg font-black text-saffron">{s.v}</p>
                    <p className="text-[8px] font-black text-navy/40 uppercase">{s.l}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {BADGES.map(b => {
                  const earned = journeyComplete || b.stage < journeyStage;
                  return (
                    <div key={b.name} className={`p-2 rounded-xl text-center border transition-all ${earned ? 'bg-cream border-saffron/10' : 'opacity-20 grayscale border-gray-100'}`}>
                      <span className="text-lg block">{b.icon}</span>
                      <p className="text-[6px] font-black uppercase text-navy leading-tight mt-0.5">{b.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { href: "/journey", icon: "📝", label: journeyComplete ? "View Journey" : "Continue Journey" },
                { href: "/chunav-mitra", icon: "🤖", label: "Chunav Mitra" },
                { href: "/help", icon: "❓", label: "Help & Forms" },
                { href: "/grievance", icon: "⚖️", label: "Grievance" },
              ].map(l => (
                <Link key={l.href} href={l.href} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm border border-border-light hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                  <span className="text-xl">{l.icon}</span>
                  <p className="text-[10px] font-bold text-navy">{l.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card p-8 border-0 shadow-xl bg-white">
              <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6 border-b border-cream pb-4">Security & Prefs</h3>
              <ul className="space-y-3">
                {["Change Password", "Notification Preferences", "Security Settings", "Language"].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => setActiveModal(item)}
                      className="w-full text-left text-[11px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all flex justify-between items-center bg-cream text-navy hover:bg-navy hover:text-white"
                    >
                      {item}
                      <span className="opacity-30">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Digital EPIC Card */}
            <div className="card p-8 border-0 shadow-2xl bg-gradient-to-br from-white to-cream border-2 border-navy/5">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-20 bg-navy/5 rounded-xl border border-navy/10 overflow-hidden flex items-center justify-center text-4xl">
                        {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : "👤"}
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-navy leading-none">DIGITAL EPIC</p>
                        <p className="text-[7px] font-bold text-saffron uppercase tracking-widest mt-1">Status: {journeyComplete ? "Active" : "Pending"}</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[8px] font-black text-text-muted uppercase">Elector Name</p>
                        <p className="text-sm font-black text-navy">{displayName}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-text-muted uppercase">State / Location</p>
                        <p className="text-[10px] font-black text-navy">{location}</p>
                     </div>
                     {regData?.dob && (
                       <div>
                         <p className="text-[8px] font-black text-text-muted uppercase">Date of Birth</p>
                         <p className="text-[10px] font-black text-navy">{regData.dob}</p>
                       </div>
                     )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-navy/5 flex justify-between items-center">
                     <span className={`text-[9px] font-black uppercase tracking-widest ${journeyComplete ? 'text-success' : 'text-navy/40'}`}>
                       {journeyComplete ? '✓ Verified Elector' : '⏳ In Progress'}
                     </span>
                     <button 
                      onClick={() => setActiveModal('QR')}
                      className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all group"
                     >
                        <div className="w-6 h-6 border-2 border-white/20 rounded-md flex items-center justify-center group-hover:border-white transition-colors">
                           <span className="text-white text-[8px] font-black leading-none">QR</span>
                        </div>
                     </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
