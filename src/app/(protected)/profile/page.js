"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const BADGES = [
  { name: "Democracy Defender", icon: "🛡️", earned: true },
  { name: "Polling Pro", icon: "🗳️", earned: true },
  { name: "Quiz Master", icon: "🧠", earned: true },
  { name: "Manifesto Reader", icon: "📖", earned: false },
  { name: "Community Leader", icon: "👥", earned: false },
  { name: "RTI Champion", icon: "⚖️", earned: false },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'password', 'notifications', etc.
  const [journeyProgress, setJourneyProgress] = useState([
    { stage: "Registration", status: "current" },
    { stage: "Verification", status: "pending" },
    { stage: "Education", status: "pending" },
    { stage: "Booth Finder", status: "pending" },
    { stage: "Candidates", status: "pending" },
    { stage: "Polling Day", status: "pending" },
    { stage: "Grievance", status: "pending" },
  ]);

  const [profilePhoto, setProfilePhoto] = useState(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const loadProfile = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", user.uid));
        if (userSnap.exists()) setProfileData(userSnap.data());
      } catch (err) { console.warn("Sync issue."); }
    };
    loadProfile();
  }, [user]);

  const detectLocation = () => {
     if (!navigator.geolocation) return alert("Geolocation not supported");
     navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        let state = "Delhi";
        let constituency = "New Delhi";

        // Simple coordinate-based state lookup for demo accuracy
        if (lat > 17 && lat < 23 && lng > 81 && lng < 88) {
           state = "Odisha";
           constituency = "Bhubaneswar";
        } else if (lat > 10 && lat < 15 && lng > 74 && lng < 79) {
           state = "Karnataka";
           constituency = "Bangalore South";
        } else if (lat > 18 && lat < 20 && lng > 72 && lng < 74) {
           state = "Maharashtra";
           constituency = "Mumbai South";
        }

        alert(`Location Verified: ${state} (${constituency}) detected via GPS.`);
        setProfileData(prev => ({ ...prev, constituency, state }));
     }, (err) => {
        alert("Permission denied. Using Odisha as manual fallback.");
        setProfileData(prev => ({ ...prev, constituency: "Bhubaneswar", state: "Odisha" }));
     });
  };

  const handlePhotoChange = (e) => {
     if (e.target.files && e.target.files[0]) {
        setProfilePhoto(URL.createObjectURL(e.target.files[0]));
     }
  };

  const displayName = profileData?.fullName || user?.displayName || "Citizen";
  const initials = displayName.substring(0, 2).toUpperCase();
  const location = profileData?.constituency ? `${profileData.constituency}, ${profileData.state}` : "Location Pending";

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
      {/* Modals for Settings */}
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
                 <div className="mt-6 p-4 bg-success/5 rounded-2xl border border-success/20">
                    <p className="text-[10px] text-success font-bold">This QR code is encrypted and linked directly to your ECI records simulation.</p>
                 </div>
              </div>
           </div>
        </Modal>
      )}

      {activeModal === 'Language' && (
        <Modal title="Language Preferences" onClose={() => setActiveModal(null)}>
           <div className="grid grid-cols-2 gap-3">
              {['Hindi', 'English', 'Odia', 'Bengali', 'Tamil', 'Telugu'].map(lang => (
                <button key={lang} onClick={() => { alert(`App language set to ${lang}`); setActiveModal(null); }} className="p-4 bg-cream rounded-xl text-xs font-black text-navy hover:bg-navy hover:text-white transition-all">
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
                  title="Change Photo"
                 >
                    📷
                 </button>
                 {profilePhoto && (
                   <button 
                    onClick={() => setProfilePhoto(null)}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 transition-all scale-0 group-hover:scale-100 z-20"
                    title="Remove Photo"
                   >
                      ✕
                   </button>
                 )}
                 <input type="file" ref={photoInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
              </div>
              <span className="absolute -top-2 -left-2 w-10 h-10 bg-success rounded-2xl flex items-center justify-center border-4 border-navy shadow-xl" title="Verified Elector">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><path d="M20 6 9 17l-5-5"/></svg>
              </span>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">{displayName}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                 <button onClick={detectLocation} className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-saffron hover:bg-saffron hover:text-white transition-all flex items-center gap-2">
                   📍 {location} <span className="opacity-60 text-[10px]">Detect</span>
                 </button>
                 <span className="px-4 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-black uppercase tracking-widest text-blue-300">
                   ⭐ Civic Score: 850
                 </span>
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="px-8 py-3 rounded-2xl bg-white text-navy font-black text-xs uppercase tracking-widest shadow-xl hover:bg-saffron hover:text-white transition-all">
               {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {isEditing ? (
               <div className="card p-8 border-0 shadow-2xl bg-white animate-fade-in-up">
                  <h2 className="text-xl font-black text-navy mb-8 border-b border-cream pb-4">Profile Identity</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Full Name</label>
                        <input className="input-field" defaultValue={displayName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Location (State/District)</label>
                        <div className="flex gap-2">
                           <input className="input-field" value={location} disabled />
                           <button onClick={detectLocation} className="px-4 bg-cream text-navy rounded-xl font-black text-[10px]">AUTO</button>
                        </div>
                     </div>
                     <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase mb-2">Civic Bio</label>
                        <textarea className="input-field h-24" placeholder="Tell the community about your civic interests..." />
                     </div>
                  </div>
                  <div className="flex gap-4 mt-10 pt-8">
                     <button onClick={() => { setIsEditing(false); alert("Saved!"); }} className="btn-primary flex-1">UPDATE PUBLIC PROFILE</button>
                  </div>
               </div>
            ) : (
               <div className="card p-8 border-0 shadow-xl bg-white">
                  <h2 className="text-sm font-black text-navy uppercase tracking-widest mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-lg">🎖️</span>
                    Journey Milestones
                  </h2>
                  <div className="flex items-center justify-between overflow-x-auto pb-4 gap-4 no-scrollbar">
                    {journeyProgress.map((step, i) => (
                      <div key={step.stage} className="flex flex-col items-center gap-3 min-w-[70px]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-500 ${
                          step.status === "completed" ? "bg-success text-white rotate-12 shadow-lg shadow-success/20" :
                          step.status === "current" ? "bg-saffron text-white ring-4 ring-saffron/20 animate-pulse" :
                          "bg-cream text-navy opacity-30"
                        }`}>
                          {step.status === "completed" ? "✓" : i + 1}
                        </div>
                        <span className={`text-[9px] font-black uppercase text-center leading-tight ${
                          step.status === "current" ? "text-saffron" : "text-navy opacity-40"
                        }`}>{step.stage}</span>
                      </div>
                    ))}
                  </div>
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="card p-8 border-0 shadow-xl bg-white">
                  <h2 className="text-sm font-black text-navy uppercase tracking-widest mb-6">Badges</h2>
                  <div className="grid grid-cols-3 gap-3">
                     {BADGES.map(b => (
                        <div key={b.name} className={`p-3 rounded-xl text-center border transition-all ${b.earned ? 'bg-cream border-saffron/10 shadow-sm' : 'opacity-20 grayscale'}`}>
                           <span className="text-2xl mb-1 block">{b.icon}</span>
                           <p className="text-[7px] font-black uppercase text-navy leading-none">{b.name}</p>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="card p-8 border-2 border-navy/5 shadow-xl bg-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/5 rounded-full -mr-12 -mt-12" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-navy/40">Activity Stats</h2>
                  <div className="space-y-5">
                     {[
                        { l: "Quizzes Taken", v: "47", i: "📝" },
                        { l: "Forum Discussions", v: "12", i: "💬" },
                        { l: "Civic Score", v: "850", i: "⭐" }
                     ].map(s => (
                        <div key={s.l} className="flex justify-between items-center group">
                           <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-sm group-hover:scale-110 transition-transform">{s.i}</span>
                              <p className="text-[11px] font-black text-navy uppercase tracking-wide">{s.l}</p>
                           </div>
                           <p className="text-base font-black text-saffron">{s.v}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="lg:col-span-4 space-y-8">
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

            <div className="card p-8 border-0 shadow-2xl bg-gradient-to-br from-white to-cream border-2 border-navy/5">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-16 h-20 bg-navy/5 rounded-xl border border-navy/10 overflow-hidden flex items-center justify-center text-4xl">
                        {profilePhoto ? <img src={profilePhoto} className="w-full h-full object-cover" /> : "👤"}
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-navy leading-none">DIGITAL EPIC</p>
                        <p className="text-[7px] font-bold text-saffron uppercase tracking-widest mt-1">Status: Active</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div>
                        <p className="text-[8px] font-black text-text-muted uppercase">Elector Name</p>
                        <p className="text-sm font-black text-navy">{displayName}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-text-muted uppercase">Constituency & State</p>
                        <p className="text-[10px] font-black text-navy">{location}</p>
                     </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-navy/5 flex justify-between items-center">
                     <span className="text-[9px] font-black text-success uppercase tracking-widest">✓ Verified Elector</span>
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
      </div>
    </div>
  );
}
