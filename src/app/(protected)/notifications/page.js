"use client";

import { useState } from "react";
import Link from "next/link";

const FILTER_TABS = [
  { label: "All", count: 12, active: true },
  { label: "Election", dot: true },
  { label: "Journey" },
  { label: "Community" },
];

const NOTIFICATIONS = [
  {
    id: 1,
    type: "warning",
    icon: "⚠️",
    title: "Voter ID Verification Required",
    badge: "ACTION NEEDED",
    badgeColor: "badge-danger",
    description: "Discrepancies found in your recent document submission. Please re-upload a clear copy of your proof of address within 48 hours to avoid registration delays.",
    action: { label: "Review Documents", href: "/journey" },
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "info",
    icon: "🏛️",
    title: "Polling Booth Assignment Changed",
    badge: null,
    description: "Your designated polling station for the upcoming general assembly elections has been updated from 'Govt School Sector 4' to 'Community Hall Sector 5'.",
    action: { label: "View on Map", href: "/journey" },
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "community",
    icon: "💬",
    title: "New Discussion in 'Local Policy'",
    badge: null,
    description: "Sanjay Verma replied to a thread you are following regarding the new zoning regulations in your constituency.",
    action: null,
    time: "Yesterday",
    unread: false,
  },
  {
    id: 4,
    type: "achievement",
    icon: "🏆",
    title: "Civic Quiz Mastered",
    badge: null,
    description: "You successfully completed the \"Constitutional Rights\" module. 50 XP has been added to your civic profile.",
    action: null,
    time: "Oct 12",
    unread: false,
  },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [deliveryMethod, setDeliveryMethod] = useState("realtime");
  const [categories, setCategories] = useState({
    election: true,
    journey: true,
    community: false,
  });

  const toggleCategory = (key) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <section className="bg-gradient-to-br from-cream to-white py-12" aria-labelledby="notif-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 id="notif-heading" className="text-3xl sm:text-4xl font-bold text-navy mb-2">Activity Stream</h1>
          <p className="text-text-secondary text-lg">Your personalized updates, alerts, and civic journey milestones.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2" role="tablist" aria-label="Notification filters">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveFilter(tab.label)}
                  role="tab"
                  aria-selected={activeFilter === tab.label}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeFilter === tab.label
                      ? "bg-saffron text-white"
                      : "bg-white text-text-secondary border border-border hover:border-navy"
                  }`}
                >
                  {tab.label}
                  {tab.count && <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{tab.count}</span>}
                  {tab.dot && <span className="w-2 h-2 bg-saffron rounded-full" aria-hidden="true"></span>}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="space-y-4" role="feed" aria-label="Notifications">
              {NOTIFICATIONS.map((notif) => (
                <article
                  key={notif.id}
                  className={`card p-5 flex gap-4 ${notif.unread ? "border-l-4 border-l-saffron" : ""}`}
                  aria-label={`${notif.unread ? "Unread: " : ""}${notif.title}`}
                >
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                    notif.type === "warning" ? "bg-red-50" :
                    notif.type === "info" ? "bg-blue-50" :
                    notif.type === "community" ? "bg-cream" :
                    "bg-green-50"
                  }`} aria-hidden="true">{notif.icon}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-navy text-sm">{notif.title}</h3>
                          {notif.badge && <span className={`badge ${notif.badgeColor} text-[10px]`}>{notif.badge}</span>}
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{notif.description}</p>
                        {notif.action && (
                          <Link href={notif.action.href} className="text-saffron text-sm font-semibold hover:underline mt-2 inline-block">
                            {notif.action.label}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-text-muted whitespace-nowrap">{notif.time}</span>
                        {notif.unread && <span className="w-2.5 h-2.5 bg-saffron rounded-full" aria-label="Unread"></span>}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="btn-secondary text-sm">
                ▼ Load Older Activity
              </button>
            </div>
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <div className="card p-5">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center gap-2">
                <span aria-hidden="true">⚙️</span> Settings
              </h2>

              {/* Delivery Method */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-navy mb-3">Delivery Method</h3>
                <div className="space-y-2">
                  {[
                    { value: "realtime", label: "Real-time Alerts", desc: "Receive notifications immediately as events happen." },
                    { value: "digest", label: "Daily Digest", desc: "A curated summary delivered once a day at 8:00 AM." },
                  ].map((opt) => (
                    <label key={opt.value} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                      deliveryMethod === opt.value ? "bg-saffron/5 border-2 border-saffron/20" : "bg-cream border-2 border-transparent"
                    }`}>
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.value}
                        checked={deliveryMethod === opt.value}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="mt-1 accent-saffron"
                      />
                      <div>
                        <p className="text-sm font-semibold text-navy">{opt.label}</p>
                        <p className="text-xs text-text-muted">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-bold text-navy mb-3">Categories</h3>
                <div className="space-y-3">
                  {[
                    { key: "election", label: "Election Updates", desc: "Polls, dates, candidates" },
                    { key: "journey", label: "Civic Journey", desc: "Achievements, tasks, learning" },
                    { key: "community", label: "Community Mentions", desc: "Replies, mentions, threads" },
                  ].map((cat) => (
                    <div key={cat.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-navy">{cat.label}</p>
                        <p className="text-xs text-text-muted">{cat.desc}</p>
                      </div>
                      <button
                        onClick={() => toggleCategory(cat.key)}
                        role="switch"
                        aria-checked={categories[cat.key]}
                        aria-label={`Toggle ${cat.label}`}
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          categories[cat.key] ? "bg-saffron" : "bg-border"
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          categories[cat.key] ? "left-5.5 translate-x-0" : "left-0.5"
                        }`} style={{ left: categories[cat.key] ? "22px" : "2px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
