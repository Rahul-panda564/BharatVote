"use client";

import { useState } from "react";
import Link from "next/link";

const MODULES_DATA = [
  { id: 1, title: "The Constitution", description: "Master the bedrock of Indian democracy.", progress: 65, icon: "📜", status: "in-progress" },
  { id: 2, title: "EVM Technology", description: "Deep dive into secure voting safeguards.", progress: 100, icon: "🗳️", status: "completed" },
  { id: 3, title: "Electoral Reforms", description: "Historical milestones to digital-first voting.", progress: 0, icon: "⚖️", status: "locked" },
  { id: 4, title: "Global Systems", description: "Compare India's model with the world.", progress: 0, icon: "🌍", status: "new", isNew: true },
];

const QUIZ_QUESTIONS = [
  { q: "Which Article ensures Equality before the law?", options: ["Article 14", "Article 19", "Article 21"], answer: 0 },
  { q: "The Election Commission was established in which year?", options: ["1947", "1950", "1952"], answer: 1 },
  { q: "What is the minimum age to vote in India?", options: ["16", "18", "21"], answer: 1 },
  { q: "How many members are nominated to Rajya Sabha by the President?", options: ["10", "12", "15"], answer: 1 },
];

export default function LearnPage() {
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === QUIZ_QUESTIONS[quizIdx].answer;
    if (isCorrect) setScore(s => s + 1);
    
    setTimeout(() => {
      if (quizIdx < QUIZ_QUESTIONS.length - 1) {
        setQuizIdx(i => i + 1);
        setSelectedAnswer(null);
      } else {
        setQuizComplete(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setQuizIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-navy text-white pt-16 pb-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-saffron text-[10px] font-black tracking-widest uppercase mb-6 border border-white/10">
                Civic Mastery Path
              </span>
              <h1 className="text-4xl sm:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
                Become a <br />
                <span className="text-saffron">Smart Voter</span>
              </h1>
              <p className="text-blue-100 text-lg opacity-80 font-medium pb-10 max-w-xl">
                Unlock achievements and master the world's largest democracy.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
               {[
                 { l: "RANK", v: "#4.2k", i: "🏆" },
                 { l: "STREAK", v: "12 Days", i: "🔥" },
                 { l: "BADGES", v: "8", i: "🎖️" },
               ].map(s => (
                 <div key={s.l} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 min-w-[120px]">
                   <p className="text-[10px] font-black text-blue-200 uppercase mb-1">{s.l}</p>
                   <p className="text-xl font-black flex items-center gap-2">{s.i} {s.v}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Main Quiz Section */}
          <div className="lg:col-span-8">
            <div className="card p-8 border-0 shadow-2xl bg-white relative overflow-hidden h-full">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="status-dot status-dot-live" />
                  <span className="text-xs font-black text-navy uppercase tracking-widest">Daily Challenge</span>
                </div>

                {!quizComplete ? (
                  <div className="animate-fade-in">
                    <h2 className="text-2xl font-black text-navy mb-6">
                      Q{quizIdx + 1}: {QUIZ_QUESTIONS[quizIdx].q}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {QUIZ_QUESTIONS[quizIdx].options.map((opt, i) => {
                        const isCorrect = i === QUIZ_QUESTIONS[quizIdx].answer;
                        const isSelected = selectedAnswer === i;
                        const showResult = selectedAnswer !== null;

                        return (
                          <button 
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className={`w-full text-left p-5 rounded-2xl text-sm font-bold border-2 transition-all duration-300 ${
                              showResult 
                                ? (isCorrect ? "bg-success text-white border-success" : (isSelected ? "bg-danger text-white border-danger" : "bg-cream opacity-50"))
                                : "bg-cream border-transparent hover:border-navy hover:bg-white"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              {opt}
                              {showResult && isCorrect && <span>✓</span>}
                              {showResult && isSelected && !isCorrect && <span>✕</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 animate-fade-in">
                    <p className="text-5xl mb-4">🏆</p>
                    <h3 className="text-2xl font-black text-navy">Mastery Level Increased!</h3>
                    <p className="text-lg font-bold text-saffron mt-2">Score: {score}/{QUIZ_QUESTIONS.length}</p>
                    <button onClick={resetQuiz} className="mt-6 px-10 py-3 bg-navy text-white rounded-2xl font-black text-sm shadow-xl">RESTART QUIZ</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Mastery Status (Replaced Myth Buster) */}
          <div className="lg:col-span-4">
             <div className="card p-8 border-0 shadow-xl bg-white text-center h-full flex flex-col justify-center">
                <h3 className="text-xs font-black text-text-muted uppercase mb-6 tracking-widest">Mastery Status</h3>
                <div className="relative inline-flex mx-auto mb-6">
                   <div className="w-32 h-32 rounded-full border-[10px] border-cream border-t-saffron animate-spin-slow flex items-center justify-center">
                      <span className="text-2xl font-black text-navy">65%</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-lg font-black text-navy">Citizen Tier: Silver</p>
                   <p className="text-xs font-bold text-saffron tracking-widest uppercase">Next Tier: Gold</p>
                   <p className="text-[10px] text-text-muted mt-4">Complete 3 more modules to upgrade</p>
                </div>
                <button className="mt-8 py-3 bg-cream text-navy rounded-xl text-[10px] font-black hover:bg-navy hover:text-white transition-all uppercase tracking-widest">
                   View Achievements
                </button>
             </div>
          </div>
        </div>

        {/* Modules in a single line (horizontal) */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-navy uppercase tracking-widest flex items-center gap-3">
              Learning Modules
              <span className="flex-1 h-px bg-border/40" />
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {MODULES_DATA.map((mod) => (
                <div key={mod.id} className="card p-6 border-0 shadow-xl bg-white group hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cream flex items-center justify-center text-2xl shadow-inner group-hover:bg-saffron transition-colors">
                      {mod.icon}
                    </div>
                    {mod.status === 'completed' && <span className="text-success">✓</span>}
                    {mod.isNew && <span className="bg-saffron text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">NEW</span>}
                  </div>
                  <h4 className="text-sm font-black text-navy mb-1">{mod.title}</h4>
                  <p className="text-[11px] text-text-secondary leading-relaxed opacity-70 mb-4 line-clamp-2">{mod.description}</p>
                  <div className="h-1 bg-cream rounded-full overflow-hidden mb-4">
                     <div className="h-full bg-saffron transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
                  </div>
                  <button onClick={() => alert("Launching module...")} className="w-full py-2 bg-cream text-navy rounded-lg text-[9px] font-black hover:bg-navy hover:text-white transition-all uppercase">
                    {mod.status === 'completed' ? 'Review' : 'Start'}
                  </button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
