"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BRAND_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/about#mission", label: "Our Mission" },
  { href: "/about#democracy", label: "Democracy Index" },
];

const QUICK_LINKS = [
  { href: "/journey", label: "Voter Registration" },
  { href: "/learn", label: "Electoral Search" },
  { href: "/live-results", label: "Live Results" },
  { href: "/help", label: "Help & Support" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/accessibility", label: "Accessibility Guide" },
];

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on auth pages as requested
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer className="bg-navy text-white mt-auto border-t border-white/5" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 font-black text-xl group" aria-label="BharatVote Home">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 group-hover:scale-110 transition-transform shadow-lg">
                <img src="/images/logo.png" alt="BharatVote Logo" className="w-full h-full object-contain" />
              </div>
              <span>Bharat<span className="text-saffron">Vote</span></span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Empowering 140 crore citizens with interactive electoral literacy and digital democratic participation.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs text-saffron-light">IN</span>
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} BharatVote. Prestige Edition.</p>
            </div>
          </div>

          {/* Brand Info */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em] mb-6">Brand Info</h3>
            <ul className="space-y-3" role="list">
              {BRAND_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em] mb-6">Quick Links</h3>
            <ul className="space-y-3" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-[0.2em] mb-6">Legal & Support</h3>
            <ul className="space-y-3 mb-8" role="list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-saffron transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Support</p>
              <a href="mailto:support@bharatvote.in" className="text-sm text-saffron-light hover:text-white transition-colors">
                support@bharatvote.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-india opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-india"></span>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">National Helpline</span>
              <span className="text-xl font-black text-white">1950</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Built with ❤️ for Indian Democracy · Powered by Google Cloud & AI
          </p>
        </div>
      </div>
    </footer>
  );
}
