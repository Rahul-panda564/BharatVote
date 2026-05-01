"use client";

import { useState } from "react";

const MP_DATA = {
  name: "Ramesh Kumar",
  type: "Lok Sabha",
  constituency: "Bangalore Central",
  term: "2019 - Present",
  margin: "45,000 Votes",
  avatar: "RK",
  stats: [
    { label: "Attendance", value: "82%", icon: "📊" },
    { label: "Questions Asked", value: "145", icon: "❓" },
    { label: "Debates", value: "32", icon: "🎤" },
    { label: "Fund Utilisation", value: "94%", icon: "₹" },
  ],
  contact: {
    office: "142, Civic Road, Indiranagar\nBangalore 560038",
    email: "rep.ramesh@sansad.nic.in",
  },
};

const PROMISES = [
  { title: "New Metro Line Extension to Whitefield", status: "fulfilled", detail: "The promised 15km extension was completed and opened to the public in March 2023, slightly ahead of the manifesto deadline.", link: "View Govt Source" },
  { title: "Lake Rejuvenation Project (Bellandur)", status: "in-progress", detail: "Initial destiling completed. STPs are currently under construction. Phase 2 delayed by 6 months due to funding clearance issues.", link: "Track Progress" },
  { title: "100% Solid Waste Segregation Plan", status: "broken", detail: "Target was 2021. Current segregation levels remain below 40%. Processing plants are running under capacity.", link: "Read Civic Report" },
];

const ACTIVITIES = [
  { date: "Oct 15, 2023", type: "Zero Hour", title: "Raised issue of Urban Flooding", description: "Demanded central assistance for upgrading storm water drains in metropolitan areas following unseasonal rains.", action: "Watch Video", color: "bg-success" },
  { date: "Sep 02, 2023", type: "Private Member Bill", title: "Introduced 'Right to Digital Privacy' Bill", description: "Aimed at regulating data collection by private entities and establishing a digital ombudsman.", action: "Read Bill Draft", color: "bg-info" },
];

const STATUS_STYLES = {
  fulfilled: { bg: "bg-green-100 text-green-800 border-green-200", dot: "bg-success", label: "FULFILLED" },
  "in-progress": { bg: "bg-amber-100 text-amber-800 border-amber-200", dot: "bg-warning", label: "IN PROGRESS" },
  broken: { bg: "bg-red-100 text-red-800 border-red-200", dot: "bg-danger", label: "BROKEN" },
};

export default function RepresentationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [issueCategory, setIssueCategory] = useState("");

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-cream to-white py-12 sm:py-16" aria-labelledby="repr-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <h1 id="repr-heading" className="text-3xl sm:text-4xl font-bold text-saffron mb-4">Representation Tracker</h1>
            </div>
            <div className="relative w-full sm:w-80">
              <label htmlFor="mp-search" className="sr-only">Search MP/MLA</label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" aria-hidden="true">🔍</span>
              <input id="mp-search" type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" placeholder="Search MP/MLA by name or constituency" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* MP Profile Card */}
            <div className="card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-green-india/30 shrink-0">
                  <img src="/mp-ramesh.png" alt={MP_DATA.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-navy">{MP_DATA.name}</h2>
                    <span className="badge badge-saffron">{MP_DATA.type}</span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">📍 Constituency: {MP_DATA.constituency}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><span aria-hidden="true">📅</span> Term: {MP_DATA.term}</span>
                    <span className="flex items-center gap-1"><span aria-hidden="true">📊</span> Margin: {MP_DATA.margin}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {MP_DATA.stats.map((stat) => (
                  <div key={stat.label} className="bg-cream rounded-xl p-4 text-center">
                    <span className="text-xl mb-1 block" aria-hidden="true">{stat.icon}</span>
                    <p className="text-2xl font-bold text-navy">{stat.value}</p>
                    <p className="text-xs text-text-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Promises vs Reality */}
            <div>
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <span aria-hidden="true">📋</span> Promises vs Reality
              </h2>
              <div className="space-y-4">
                {PROMISES.map((promise) => {
                  const style = STATUS_STYLES[promise.status];
                  return (
                    <div key={promise.title} className="card p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-bold text-navy">{promise.title}</h3>
                        <span className={`badge border ${style.bg} shrink-0`}>
                          <span className={`w-2 h-2 rounded-full ${style.dot}`} aria-hidden="true"></span>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-3 leading-relaxed">{promise.detail}</p>
                      <button className="text-saffron text-sm font-semibold hover:underline">
                        {promise.link} ↗
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Parliamentary Activity */}
            <div>
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <span aria-hidden="true">🕐</span> Parliamentary Activity
              </h2>
              <div className="space-y-4">
                {ACTIVITIES.map((activity) => (
                  <div key={activity.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className={`w-4 h-4 rounded-full ${activity.color} shrink-0`} aria-hidden="true"></span>
                      <div className="w-0.5 h-full bg-border mt-1" aria-hidden="true"></div>
                    </div>
                    <div className="card p-5 flex-1 mb-2">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-text-muted">{activity.date}</span>
                        <span className="badge badge-navy text-[10px]">{activity.type}</span>
                      </div>
                      <h3 className="font-bold text-navy mb-1">{activity.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{activity.description}</p>
                      <button className="text-saffron text-sm font-semibold hover:underline flex items-center gap-1">
                        🎥 {activity.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="card p-5">
              <h3 className="font-bold text-navy mb-4">Civic Engagement</h3>
              <p className="text-sm text-text-secondary mb-4">Hold your representative accountable. Use the tools below to initiate contact.</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-saffron mt-0.5" aria-hidden="true">📍</span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Local Office</p>
                    <p className="text-xs text-text-secondary whitespace-pre-line">{MP_DATA.contact.office}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-saffron mt-0.5" aria-hidden="true">✉️</span>
                  <div>
                    <p className="text-sm font-semibold text-navy">Email Address</p>
                    <a href={`mailto:${MP_DATA.contact.email}`} className="text-xs text-info hover:underline">{MP_DATA.contact.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Draft a Letter */}
            <div className="card p-5 bg-navy text-white">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span aria-hidden="true">✍️</span> Draft a Letter
              </h3>
              <p className="text-sm text-gray-300 mb-4">Use our AI-assisted tool to generate formal correspondence regarding local issues.</p>
              <label htmlFor="issue-category" className="sr-only">Select issue category</label>
              <select id="issue-category" value={issueCategory} onChange={(e) => setIssueCategory(e.target.value)} className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2.5 text-sm mb-3">
                <option value="" className="text-navy">Select Issue Category...</option>
                <option value="infrastructure" className="text-navy">Infrastructure</option>
                <option value="education" className="text-navy">Education</option>
                <option value="healthcare" className="text-navy">Healthcare</option>
                <option value="environment" className="text-navy">Environment</option>
              </select>
              <button className="btn-primary w-full justify-center bg-success hover:bg-green-india">
                ✨ Generate Draft
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
