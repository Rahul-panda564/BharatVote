"use client";

import { useState, useRef, useEffect } from "react";
import { getChunavMitraResponse } from "@/lib/gemini";

const SUGGESTIONS = ["How to register?", "Who are my candidates?", "Find Polling Booth"];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "assistant",
    content: "Namaste! I am Chunav Mitra, your personal guide to the democratic process. How can I assist you with your voting journey today?",
    time: "10:45 AM",
  },
];

const CHAT_HISTORY = [
  { label: "Voter ID registration requirements", day: "Today" },
  { label: "Polling booth location search", day: "Yesterday" },
  { label: "Candidate details for Ward 42", day: "Yesterday" },
];

const KNOWLEDGE_TOPICS = [
  "Voter Registration", "EVM Process", "VVPAT Verification", "Counting Procedure",
  "Electoral Roll", "Booth Finder", "RTI Filing", "Grievance Portal",
];

const AI_RESPONSES = {
  "how to register": "To register as a voter in India, you need to:\n\n1. **Visit** the official ECI Voter Portal at voters.eci.gov.in\n2. **Fill Form 6** with your personal details and address\n3. **Upload** proof of age and address (Aadhaar, Passport, etc.)\n4. **Submit** the application and note your reference number\n5. **Wait** for BLO verification at your address\n\nYou can also use the **Voter Helpline App** (available on Android/iOS) or visit your nearest ERO office.\n\n📞 Helpline: **1950**",
  "who are my candidates": "To find your candidates:\n\n1. Go to **voters.eci.gov.in** and search your constituency\n2. During election period, the ECI publishes the **final list of candidates** after scrutiny\n3. You can also use our **Journey** module to explore candidate profiles\n\nWould you like me to help you find your constituency based on your PIN code?",
  "find polling booth": "To find your polling booth:\n\n1. Visit **electoralsearch.eci.gov.in**\n2. Search by your **Name** or **EPIC Number**\n3. Your booth details including address will be displayed\n\nYou can also use our **Google Maps Booth Locator** in the Journey section.",
  default: "Thank you for your question! I'm processing your query. For the most accurate information, I recommend:\n\n1. Visiting the **official ECI website** at eci.gov.in\n2. Calling the **National Voter Helpline** at 1950\n3. Using the **Voter Helpline App**\n\nIs there something specific about the electoral process I can help with?",
};

export default function ChunavMitraPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef(null);

  // Hydration fix using layout effect for smoother transition
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(AI_RESPONSES)) {
      if (key !== "default" && lower.includes(key)) return response;
    }
    return AI_RESPONSES.default;
  };

  const sendMessage = (text) => {
    const content = text || inputText.trim();
    if (!content) return;

    const msgId = `u-${crypto.randomUUID()}`;
    const userMsg = {
      id: msgId,
      role: "user",
      content,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(async () => {
      const responseText = await getChunavMitraResponse(content, messages);
      const aiResponse = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: responseText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Standalone Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="w-10 h-10 rounded-xl bg-white border border-border-light shadow-sm flex items-center justify-center text-navy hover:bg-cream transition-colors"
          aria-label="Go back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 className="text-2xl font-black text-navy tracking-tight">Chunav Mitra AI</h1>
          <p className="text-sm text-text-secondary">Your 24/7 electoral literacy companion</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
        {/* Sidebar */}
        <div className="lg:col-span-1 card p-5 flex flex-col">
          <div className="flex gap-1 mb-4 bg-cream rounded-xl p-1">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "history" ? "bg-white text-navy shadow-sm" : "text-text-muted"
              }`}
            >
              Chat History
            </button>
            <button
              onClick={() => setActiveTab("knowledge")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "knowledge" ? "bg-white text-navy shadow-sm" : "text-text-muted"
              }`}
            >
              Knowledge Base
            </button>
          </div>

          {activeTab === "history" ? (
            <div className="space-y-4 flex-1 overflow-y-auto">
              {Object.entries(
                CHAT_HISTORY.reduce((acc, item) => {
                  if (!acc[item.day]) acc[item.day] = [];
                  acc[item.day].push(item);
                  return acc;
                }, {})
              ).map(([day, items]) => (
                <div key={day}>
                  <p className="text-xs font-bold text-text-muted uppercase mb-2">{day}</p>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item.label}>
                        <button className="w-full text-left text-sm text-text-secondary hover:text-navy hover:bg-cream px-3 py-2 rounded-lg transition-colors truncate">
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {KNOWLEDGE_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => sendMessage(topic)}
                    className="badge badge-navy hover:bg-navy hover:text-white transition-colors cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 card flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border-light flex items-center justify-between">
            <div>
              <h2 className="font-bold text-navy">AI Assistant</h2>
              <span className="flex items-center gap-1.5 text-xs text-success">
                <span className="status-dot status-dot-live" aria-hidden="true"></span>
                Online
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <button 
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="px-3 py-1.5 text-xs font-semibold text-danger bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5"
                aria-label="Clear chat"
              >
                <span>🗑️</span> Clear
              </button>
              <button className="p-2 text-text-muted hover:text-navy flex items-center justify-center rounded-lg hover:bg-cream transition-colors" aria-label="Download chat">⬇️</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" role="log" aria-label="Chat messages" aria-live="polite">
            <p className="text-center text-xs text-text-muted bg-cream rounded-full px-4 py-1.5 w-fit mx-auto mb-4">
              Session started: {INITIAL_MESSAGES[0].time}
            </p>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <span className="w-9 h-9 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-bold shrink-0" aria-hidden="true">🏛️</span>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-navy text-white rounded-br-md"
                    : "bg-cream text-text-primary rounded-bl-md"
                }`}>
                  <div className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <span className="w-9 h-9 rounded-full bg-gray-200 text-text-secondary flex items-center justify-center text-sm shrink-0" aria-hidden="true">👤</span>
                )}
              </div>
            ))}

            {/* Suggestions after first message */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 ml-12">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-saffron/30 text-saffron hover:bg-saffron/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {isTyping && (
              <div className="flex gap-3">
                <span className="w-9 h-9 rounded-full bg-saffron text-white flex items-center justify-center text-sm font-bold shrink-0" aria-hidden="true">🏛️</span>
                <div className="bg-cream rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-muted rounded-full" style={{ animation: "typing 1s ease-in-out infinite" }}></span>
                    <span className="w-2 h-2 bg-text-muted rounded-full" style={{ animation: "typing 1s ease-in-out 0.2s infinite" }}></span>
                    <span className="w-2 h-2 bg-text-muted rounded-full" style={{ animation: "typing 1s ease-in-out 0.4s infinite" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border-light">
            <div className="flex items-center gap-3">
              <button className="p-2 text-text-muted hover:text-navy" aria-label="Attach file">📎</button>
              <label htmlFor="chat-input" className="sr-only">Type your question</label>
              <input
                id="chat-input"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input-field flex-1"
                placeholder="Type your question here..."
              />
              <button className="p-2 text-text-muted hover:text-navy" aria-label="Voice input">🎤</button>
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-full bg-saffron text-white flex items-center justify-center hover:bg-saffron-dark transition-colors disabled:opacity-50"
                aria-label="Send message"
                id="send-message"
              >
                ▶
              </button>
            </div>
            <p className="text-xs text-text-muted text-center mt-2">
              Chunav Mitra can make mistakes. Verify important information with official ECI sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
