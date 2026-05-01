import Link from "next/link";
import Footer from "@/components/Footer";

const JOURNEY_STAGES = [
  {
    number: "01",
    title: "Registration",
    subtitle: "Mera Pehla Vote",
    description: "Submit Form 6 to register as a new voter and enter the electoral roll.",
    icon: "📝",
    href: "/journey",
    color: "bg-saffron text-white",
  },
  {
    number: "02",
    title: "Verification",
    subtitle: "Janch-Parch",
    description: "Track your BLO verification and confirm your name in the voter list.",
    icon: "🔍",
    href: "/journey",
    color: "bg-blue-600 text-white",
  },
  {
    number: "03",
    title: "Education",
    subtitle: "Chunav Pathshala",
    description: "Master election concepts through 3D interactive modules and quizzes.",
    icon: "📚",
    href: "/learn",
    color: "bg-green-600 text-white",
  },
  {
    number: "04",
    title: "Booth Finder",
    subtitle: "Pehchano Kendra",
    description: "Locate your polling station on Google Maps and check queue status.",
    icon: "📍",
    href: "/journey",
    color: "bg-purple-600 text-white",
  },
  {
    number: "05",
    title: "Candidates",
    subtitle: "Pratinidhi Chuno",
    description: "Analyze representative performance, promises, and attendance records.",
    icon: "👤",
    href: "/representation",
    color: "bg-amber-600 text-white",
  },
  {
    number: "06",
    title: "Polling Day",
    subtitle: "Matdan Simulator",
    description: "Practice voting on a 3D EVM & VVPAT simulator before the big day.",
    icon: "🗳️",
    href: "/polling-day",
    color: "bg-indigo-600 text-white",
  },
  {
    number: "07",
    title: "Grievance",
    subtitle: "Samadhan Portal",
    description: "File complaints or RTI applications with AI-powered draft generation.",
    icon: "⚖️",
    href: "/grievance",
    color: "bg-teal-600 text-white",
  },
];

const STATS = [
  { value: "96.8Cr", label: "Registered Voters", icon: "👥" },
  { value: "10.5L", label: "Polling Stations", icon: "🏫" },
  { value: "543", label: "Lok Sabha Seats", icon: "🏛️" },
  { value: "28+8", label: "States & UTs", icon: "🗺️" },
];

const FEATURES = [
  {
    icon: "🤖",
    title: "Chunav Mitra AI",
    description: "Your multilingual AI assistant answers election queries in 12 Indian languages with voice support.",
  },
  {
    icon: "🎮",
    title: "Gamified Learning",
    description: "Earn badges, climb leaderboards, and take daily civic challenges to boost your election IQ.",
  },
  {
    icon: "🗺️",
    title: "Booth Locator",
    description: "Find your exact polling booth on Google Maps with directions, queue estimates, and accessibility info.",
  },
  {
    icon: "📱",
    title: "Works Offline",
    description: "Download content packs for your state. Access everything without internet in rural areas.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Balanced Typography-Focused Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1222] via-navy to-[#1a1f3c] min-h-[80vh] flex items-center justify-center text-center pt-24 pb-12" aria-labelledby="hero-heading">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-saffron rounded-full blur-[100px] mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-india rounded-full blur-[100px] mix-blend-screen animate-pulse animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-8 shadow-xl">
            <span className="flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-saffron opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-saffron"></span>
            </span>
            <span className="text-[10px] font-black text-white tracking-[0.25em] uppercase">Electoral Intelligence & Simulation</span>
          </div>
          
          <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-8">
            Your Vote. <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron via-white to-green-india text-5xl sm:text-6xl lg:text-8xl block mt-2">Your Power.</span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            The national platform for immersive election literacy. Master the process through 3D simulations and AI guidance.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/journey" className="px-8 py-4 bg-saffron text-white font-black rounded-2xl hover:bg-saffron-dark transition-all shadow-lg text-base">
              Get Started →
            </Link>
            <Link href="/chunav-mitra" className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all text-base">
              Ask AI 🤖
            </Link>
            <Link href="/learn" className="px-8 py-4 bg-white text-navy font-bold rounded-2xl hover:bg-cream transition-all text-base shadow-lg">
              Take a Quiz 📝
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border-light" aria-label="Election statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="text-2xl mb-1 block" role="img" aria-hidden="true">{stat.icon}</span>
                <p className="text-2xl sm:text-3xl font-bold text-navy">{stat.value}</p>
                <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Spotlight */}
      <section className="py-32 bg-navy relative overflow-hidden" aria-labelledby="ai-heading">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="badge badge-saffron mb-6 px-4 py-2 text-sm">Powered by Gemini AI</span>
              <h2 id="ai-heading" className="text-4xl sm:text-5xl font-black text-white mb-8 leading-tight">
                Chunav Mitra:<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-saffron-light">Smart Voter Support</span>
              </h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
                Your AI-powered bridge to democratic awareness. Instant answers, multilingual clarity, and 24/7 personalized guidance.
              </p>
              <Link href="/chunav-mitra" className="inline-flex items-center gap-4 px-12 py-5 bg-saffron text-white font-black rounded-2xl hover:bg-saffron-dark transition-all shadow-2xl shadow-saffron/30 text-lg">
                Start Chatting 🤖
              </Link>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-10 bg-saffron/20 blur-[80px] rounded-full animate-pulse" />
                <div className="card bg-white/10 backdrop-blur-2xl border-white/20 p-6 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden group">
                  <img 
                    src="/images/ai-bot.png" 
                    alt="Chunav Mitra AI Avatar" 
                    className="w-full h-auto rounded-[2rem] transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute top-6 right-6 bg-green-india text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-3 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    AI AGENT ONLINE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Stages Journey */}
      <section className="py-20 bg-cream" aria-labelledby="stages-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-saffron mb-3">The Electoral Lifecycle</span>
            <h2 id="stages-heading" className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              7 Stages of Your Democratic Journey
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              From your first registration to holding representatives accountable, BharatVote guides you through every step of India&apos;s democratic process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative">
            {/* Visual connector for desktop */}
            <div className="hidden lg:block absolute top-[100px] left-0 right-0 h-0.5 bg-gray-200 -z-0" />
            
            {JOURNEY_STAGES.map((stage, idx) => (
              <Link
                key={stage.number}
                href={stage.href}
                className="card p-6 group cursor-pointer block relative z-10 hover:border-saffron transition-all hover:-translate-y-1"
                id={`stage-${stage.number}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${stage.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <span role="img" aria-hidden="true">{stage.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Stage {stage.number}</span>
                  <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-saffron transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-[10px] font-bold text-saffron/80 mb-3">{stage.subtitle}</p>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">{stage.description}</p>
                </div>
              </Link>
            ))}

            {/* CTA Card */}
            <div className="card p-6 bg-navy text-white flex flex-col justify-center items-center text-center relative z-10">
              <span className="text-3xl mb-3" role="img" aria-hidden="true">🇮🇳</span>
              <h3 className="text-lg font-bold mb-2">Ready to Start?</h3>
              <Link href="/journey" className="bg-saffron text-white font-bold px-6 py-2 rounded-lg hover:bg-saffron-dark transition-colors text-xs">
                Begin Journey →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge badge-navy mb-3">Powered by Google Services</span>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold text-navy mb-4">
              Extraordinary Features
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Built with cutting-edge technology to make election literacy accessible, engaging, and impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="card p-6 text-center"
              >
                <span className="text-4xl block mb-4" role="img" aria-hidden="true">{feature.icon}</span>
                <h3 className="text-lg font-bold text-navy mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Services Banner */}
      <section className="py-16 bg-cream" aria-labelledby="google-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12 text-center">
            <h2 id="google-heading" className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              Built on the Google Ecosystem
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto mb-8">
              Leveraging the full power of Google Services for security, intelligence, and reach.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-semibold text-text-secondary">
              {[
                "Firebase Auth",
                "Cloud Firestore",
                "Gemini AI",
                "Google Maps",
                "Google Translate",
                "Google Analytics",
              ].map((service) => (
                <span key={service} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <span className="w-2 h-2 bg-green-india rounded-full" aria-hidden="true"></span>
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-navy-dark text-white text-center" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Every Vote Counts. Every Citizen Matters.
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Start your journey today and become a confident, informed voter.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/journey" className="btn-primary text-base px-10 py-4" id="cta-bottom">
              Begin Your Journey →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
