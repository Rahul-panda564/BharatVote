"use client";

import { useState } from "react";

const STATES = [
  { id: "UP", name: "Uttar Pradesh", seats: 80, leading: "NDA", color: "#F39C12" },
  { id: "MH", name: "Maharashtra", seats: 48, leading: "INDIA", color: "#3498DB" },
  { id: "WB", name: "West Bengal", seats: 42, leading: "INDIA", color: "#2ECC71" },
  { id: "BR", name: "Bihar", seats: 40, leading: "NDA", color: "#F39C12" },
  { id: "TN", name: "Tamil Nadu", seats: 39, leading: "INDIA", color: "#3498DB" },
  { id: "MP", name: "Madhya Pradesh", seats: 29, leading: "NDA", color: "#F39C12" },
  { id: "KA", name: "Karnataka", seats: 28, leading: "INDIA", color: "#3498DB" },
  { id: "GJ", name: "Gujarat", seats: 26, leading: "NDA", color: "#F39C12" },
  { id: "AP", name: "Andhra Pradesh", seats: 25, leading: "Others", color: "#95A5A6" },
  { id: "RJ", name: "Rajasthan", seats: 25, leading: "NDA", color: "#F39C12" },
];

export default function InteractiveMap() {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  return (
    <div className="relative group">
      {/* State Info Overlay */}
      {(hoveredState || selectedState) && (
        <div className="absolute top-4 left-4 z-20 bg-navy/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 animate-fade-in pointer-events-none">
          <p className="text-[10px] font-bold text-saffron uppercase tracking-widest mb-1">State Highlights</p>
          <h4 className="text-xl font-black">{(hoveredState || selectedState).name}</h4>
          <div className="flex gap-4 mt-2">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Seats</p>
              <p className="text-lg font-bold">{(hoveredState || selectedState).seats}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Leading</p>
              <p className={`text-lg font-bold ${(hoveredState || selectedState).leading === "NDA" ? "text-saffron" : "text-blue-400"}`}>
                {(hoveredState || selectedState).leading}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive SVG Map (Simplified Representation) */}
      <div className="bg-navy-dark rounded-2xl p-8 flex items-center justify-center min-h-[400px] overflow-hidden">
        <svg 
          viewBox="0 0 400 500" 
          className="w-full max-w-[400px] drop-shadow-[0_0_30px_rgba(243,156,18,0.1)]"
          style={{ filter: "drop-shadow(0 0 20px rgba(0,0,0,0.5))" }}
        >
          {/* This is a simplified stylistic map of India using stylized paths */}
          <g transform="translate(50, 50)">
            {/* Uttar Pradesh */}
            <path 
              d="M150,150 L200,140 L230,160 L220,200 L170,210 Z" 
              className={`transition-all duration-300 cursor-pointer ${hoveredState?.id === "UP" ? "fill-saffron stroke-white stroke-2 scale-105" : "fill-saffron/40 stroke-saffron/60"}`}
              data-testid="state-path-up"
              onMouseEnter={() => setHoveredState(STATES[0])}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(STATES[0])}
            />
            {/* Maharashtra */}
            <path 
              d="M100,280 L150,270 L170,320 L130,350 L90,330 Z" 
              className={`transition-all duration-300 cursor-pointer ${hoveredState?.id === "MH" ? "fill-blue-500 stroke-white stroke-2 scale-105" : "fill-blue-500/40 stroke-blue-500/60"}`}
              data-testid="state-path-mh"
              onMouseEnter={() => setHoveredState(STATES[1])}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(STATES[1])}
            />
            {/* West Bengal */}
            <path 
              d="M260,200 L280,210 L275,250 L250,260 L245,220 Z" 
              className={`transition-all duration-300 cursor-pointer ${hoveredState?.id === "WB" ? "fill-green-500 stroke-white stroke-2 scale-105" : "fill-green-500/40 stroke-green-500/60"}`}
              data-testid="state-path-wb"
              onMouseEnter={() => setHoveredState(STATES[2])}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(STATES[2])}
            />
             {/* Tamil Nadu */}
             <path 
              d="M140,400 L170,410 L160,450 L130,440 Z" 
              className={`transition-all duration-300 cursor-pointer ${hoveredState?.id === "TN" ? "fill-blue-400 stroke-white stroke-2 scale-105" : "fill-blue-400/40 stroke-blue-400/60"}`}
              data-testid="state-path-tn"
              onMouseEnter={() => setHoveredState(STATES[4])}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(STATES[4])}
            />
            {/* Rest of Map (Simplified Outline) */}
            <path 
              d="M150,50 L200,80 L250,150 L280,200 L300,280 L250,400 L150,450 L50,400 L30,280 L50,150 L100,80 Z" 
              fill="none" 
              stroke="white" 
              strokeWidth="1" 
              strokeDasharray="4 4" 
              opacity="0.2"
            />
          </g>
        </svg>

        <div className="absolute bottom-6 right-6 text-right">
          <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Interactive Mode</p>
          <div className="flex gap-2">
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-saffron" />
               <span className="text-[10px] text-white/60 font-bold uppercase">NDA</span>
             </div>
             <div className="flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-blue-500" />
               <span className="text-[10px] text-white/60 font-bold uppercase">INDIA</span>
             </div>
          </div>
        </div>
      </div>

      {/* Grid of All States for Mobile/Fallback */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
        {STATES.map((state) => (
          <button 
            key={state.id}
            onMouseEnter={() => setHoveredState(state)}
            onMouseLeave={() => setHoveredState(null)}
            className={`p-3 rounded-xl border transition-all text-left ${hoveredState?.id === state.id ? "bg-navy text-white border-navy shadow-lg" : "bg-white text-navy border-border hover:border-saffron"}`}
          >
            <p className="text-[10px] font-bold opacity-60 leading-none mb-1">{state.id}</p>
            <p className="text-xs font-black truncate">{state.name}</p>
            <p className="text-[10px] font-bold mt-1 text-saffron">{state.seats} Seats</p>
          </button>
        ))}
      </div>
    </div>
  );
}
