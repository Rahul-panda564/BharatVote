"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ALLIANCES = [
  { name: "NDA (BJP+)", seats: 294, change: +12, color: "bg-orange-600" },
  { name: "I.N.D.I.A (INC+)", seats: 206, change: +8, color: "bg-blue-600" },
  { name: "Others (TMC, AAP, etc.)", seats: 43, change: 0, color: "bg-gray-400" },
];

const TRENDING = [
  { constituency: "Varanasi", candidate: "Narendra Modi (BJP)", status: "Leading", margin: "+4.5L", color: "text-success" },
  { constituency: "Wayanad", candidate: "Rahul Gandhi (INC)", status: "Leading", margin: "+3.2L", color: "text-success" },
  { constituency: "Lucknow", candidate: "Rajnath Singh (BJP)", status: "Leading", margin: "+1.8L", color: "text-success" },
  { constituency: "Baramati", candidate: "Supriya Sule (NCP-SP)", status: "Trailing", margin: "-12k", color: "text-danger" },
];

const REAL_PARTIES = [
  { name: "BJP", full: "Bharatiya Janata Party", seats: 240, color: "bg-orange-600", symbol: "🪷" },
  { name: "INC", full: "Indian National Congress", seats: 99, color: "bg-blue-600", symbol: "✋" },
  { name: "AAP", full: "Aam Aadmi Party", seats: 3, color: "bg-yellow-500", symbol: "🧹" },
  { name: "TMC", full: "Trinamool Congress", seats: 29, color: "bg-green-600", symbol: "🌿" },
  { name: "DMK", full: "Dravida Munnetra Kazhagam", seats: 22, color: "bg-red-600", symbol: "☀️" },
  { name: "SP", full: "Samajwadi Party", seats: 37, color: "bg-green-500", symbol: "🚲" },
  { name: "Others", full: "Independent & State Parties", seats: 113, color: "bg-gray-500", symbol: "🗳️" },
];

const UPDATES = [
  { time: "Live", text: "NDA reaches 294 mark, cross-majority in current trends." },
  { time: "10m ago", text: "SP shows massive gains in Uttar Pradesh with 37 seats leading." },
  { time: "25m ago", text: "TMC maintains strong hold in West Bengal leading in 29 seats." },
];

export default function LiveResultsPage() {
  const [lastUpdated, setLastUpdated] = useState("");
  const [coalitionSeats, setCoalitionSeats] = useState(0);
  const [selectedParties, setSelectedParties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }));
  }, []);

  const toggleParty = (party) => {
    setSelectedParties(prev => {
      const exists = prev.find(p => p.name === party.name);
      const next = exists ? prev.filter(p => p.name !== party.name) : [...prev, party];
      setCoalitionSeats(next.reduce((sum, p) => sum + p.seats, 0));
      return next;
    });
  };

  const majority = 272;

  return (
    <div className="bg-cream min-h-screen">
      {/* Premium Results Header */}
      <section className="bg-navy text-white pt-16 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                 <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/20 text-danger text-[10px] font-black uppercase tracking-widest mb-4 border border-danger/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse" /> Live Pulse
                 </span>
                 <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
                    Election <span className="text-saffron">Tally 2024</span>
                 </h1>
                 <p className="text-blue-200 text-sm font-medium opacity-80">National Dashboard & Coalition Simulator</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-right">
                 <p className="text-[10px] font-black text-blue-300 uppercase">Last Sync</p>
                 <p className="text-lg font-black text-white">{lastUpdated}</p>
              </div>
           </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-16 pb-20 relative z-20">
         {/* National Alliance Bar */}
         <div className="card p-8 border-0 shadow-2xl bg-white mb-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-black text-navy uppercase tracking-tight">National Alliance Tally</h2>
               <span className="text-xs font-bold text-text-muted">Majority: <span className="text-navy">272</span></span>
            </div>
            
            <div className="h-10 w-full flex rounded-2xl overflow-hidden shadow-inner mb-8">
               {ALLIANCES.map(a => (
                 <div key={a.name} className={`${a.color} flex items-center justify-center transition-all duration-1000`} style={{ width: `${(a.seats/543)*100}%` }}>
                    <span className="text-[10px] font-black text-white px-2 truncate">{a.name}</span>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {ALLIANCES.map(a => (
                 <div key={a.name} className="flex items-center gap-4 p-4 rounded-2xl bg-cream">
                    <div className={`w-3 h-12 rounded-full ${a.color}`} />
                    <div>
                       <p className="text-xs font-black text-navy opacity-60">{a.name}</p>
                       <p className="text-3xl font-black text-navy">{a.seats}</p>
                       <p className={`text-[10px] font-black ${a.change > 0 ? 'text-success' : 'text-danger'}`}>
                         {a.change > 0 ? '↑ Gain ' : '↓ Loss '}{Math.abs(a.change)} Seats
                       </p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Map & Trending */}
            <div className="lg:col-span-8 space-y-8">
               <div className="card p-6 border-0 shadow-xl bg-white">
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6">Constituency Hotspots</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {TRENDING.map(t => (
                        <div key={t.constituency} className="p-5 rounded-2xl border-2 border-cream group hover:border-saffron transition-all cursor-pointer">
                           <div className="flex justify-between items-start mb-3">
                              <p className="text-xs font-black text-text-muted uppercase">{t.constituency}</p>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-success/10 ${t.color}`}>{t.status}</span>
                           </div>
                           <h4 className="text-sm font-black text-navy mb-1">{t.candidate}</h4>
                           <p className="text-lg font-black text-saffron">Margin: {t.margin}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Coalition Simulator */}
               <div className="card border-0 shadow-2xl bg-navy text-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-saffron/10" />
                  
                  <div className="relative p-8 z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-black tracking-tight mb-1">Government Formation Meter</h3>
                        <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-60">Build your 272+ majority coalition</p>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-[10px] font-black uppercase">
                        Target: 272
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-10">
                       {/* Circular Meter */}
                       <div className="relative w-40 h-40 mx-auto">
                          <svg className="w-full h-full -rotate-90">
                             <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-white/5" />
                             <circle cx="80" cy="80" r="70" fill="none" stroke={coalitionSeats >= majority ? "#27AE60" : "#F39C12"} strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (Math.min(coalitionSeats, majority) / majority) * 440} strokeLinecap="round" className="transition-all duration-1000 shadow-[0_0_20px_rgba(243,156,18,0.5)]" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className={`text-4xl font-black ${coalitionSeats >= majority ? "text-success" : "text-white"}`}>{coalitionSeats}</span>
                             <span className="text-[10px] font-black opacity-40 uppercase">SEATS</span>
                          </div>
                       </div>

                       <div className="md:col-span-2 space-y-6">
                          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                             {coalitionSeats >= majority ? (
                               <div className="animate-fade-in">
                                  <p className="text-success text-xs font-black uppercase mb-1 flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-success animate-ping" /> Majority Secured
                                  </p>
                                  <h4 className="text-lg font-black leading-tight mb-2 text-white">Government can be formed!</h4>
                                  <p className="text-[10px] text-blue-200 opacity-70">This coalition holds {coalitionSeats} seats, which is {coalitionSeats - majority} more than the required mark.</p>
                               </div>
                             ) : (
                               <div>
                                  <p className="text-saffron text-xs font-black uppercase mb-1">Status: Pending</p>
                                  <h4 className="text-lg font-black leading-tight mb-2 text-white">Select parties to reach 272</h4>
                                  <p className="text-[10px] text-blue-200 opacity-70">You currently need {majority - coalitionSeats} more seats to reach a majority government.</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
                       {REAL_PARTIES.map(p => {
                         const isSelected = selectedParties.find(s => s.name === p.name);
                         return (
                           <button 
                            key={p.name}
                            onClick={() => toggleParty(p)}
                            className={`px-4 py-2.5 rounded-xl border-2 transition-all flex items-center gap-2 ${
                              isSelected ? "bg-white text-navy border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                            }`}
                           >
                              <span className="text-sm">{p.symbol}</span>
                              <p className="text-[10px] font-black uppercase">{p.name}</p>
                           </button>
                         )
                       })}
                    </div>
                  </div>
               </div>
            </div>

            {/* Right: Party Pulse & News */}
            <div className="lg:col-span-4 space-y-8">
               <div className="card p-6 border-0 shadow-xl bg-white">
                  <h3 className="text-sm font-black text-navy uppercase tracking-widest mb-6">Live Party Pulse</h3>
                  <div className="space-y-4">
                     {REAL_PARTIES.map(p => (
                        <div key={p.name} className="flex items-center gap-3">
                           <span className="text-xl w-8 h-8 rounded-lg bg-cream flex items-center justify-center">{p.symbol}</span>
                           <div className="flex-1">
                              <div className="flex justify-between items-end mb-1">
                                 <p className="text-xs font-black text-navy">{p.name}</p>
                                 <p className="text-xs font-black text-navy">{p.seats}</p>
                              </div>
                              <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden">
                                 <div className={`h-full ${p.color}`} style={{ width: `${(p.seats/300)*100}%` }} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="card p-6 border-0 shadow-xl bg-saffron text-navy">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-navy animate-ping" /> Breaking Now
                  </h3>
                  <div className="space-y-6">
                     {UPDATES.map((u, i) => (
                        <div key={i} className="border-l-2 border-navy/20 pl-4 py-1">
                           <p className="text-[9px] font-black uppercase opacity-60 mb-1">{u.time}</p>
                           <p className="text-xs font-bold leading-relaxed">{u.text}</p>
                        </div>
                     ))}
                  </div>
                  <button className="w-full mt-8 py-3 bg-navy text-white rounded-xl text-[10px] font-black hover:scale-105 transition-all uppercase tracking-widest">
                     View All Bulletins
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
