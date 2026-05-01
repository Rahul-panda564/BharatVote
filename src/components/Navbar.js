"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GoogleTranslate from "./GoogleTranslate";
import { useAuth } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/journey", label: "Journey", id: "nav-journey" },
  { href: "/learn", label: "Learn", id: "nav-learn" },
  { href: "/live-results", label: "Live Results", id: "nav-results" },
  { href: "/community", label: "Community", id: "nav-community" },
  { href: "/help", label: "Help", id: "nav-help" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trap focus inside mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (pathname?.startsWith("/auth") || pathname?.startsWith("/chunav-mitra")) {
    return null;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-nav"
          : "bg-white"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform">
            <img src="/images/logo.png" alt="BharatVote Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-black text-xl tracking-tighter text-navy group-hover:text-saffron transition-colors">
            Bharat<span className="text-saffron">Vote</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1" role="menubar">
          {NAV_LINKS.map((link) => (
            <li key={link.href} role="none">
              <Link
                href={link.href}
                id={link.id}
                role="menuitem"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "text-saffron"
                    : "text-text-secondary hover:text-navy hover:bg-cream"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <GoogleTranslate />
          {user ? (
            <>
                <Link
                  href="/notifications"
                  className={`relative p-2 rounded-lg transition-all ${
                    pathname === "/notifications" ? "text-saffron bg-cream" : "text-text-secondary hover:text-saffron hover:bg-cream"
                  }`}
                  aria-label="Notifications"
                  id="nav-notifications"
                  onClick={() => { if (typeof window !== 'undefined') localStorage.setItem('bv_notif_read', 'true'); }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  {typeof window !== 'undefined' && !localStorage.getItem('bv_notif_read') && !pathname.startsWith("/notifications") && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-saffron text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md" aria-label="2 unread notifications">2</span>
                  )}
                </Link>
              <Link
                href="/profile"
                className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs hover:bg-navy-light transition-colors"
                aria-label="User profile"
                id="nav-profile"
              >
                {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "BV"}
              </Link>
              <button 
                onClick={() => logout()}
                className="text-xs font-bold text-danger hover:bg-red-50 transition-all px-3 py-1.5 rounded-lg border border-red-100 shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="text-sm font-bold text-navy px-4 py-2 hover:bg-cream rounded-lg transition-colors">Login</Link>
              <Link href="/auth/signup" className="btn-primary text-xs px-4 py-2">Join</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-cream transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          id="mobile-menu-button"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden border-t border-border-light bg-white animate-fade-in"
          role="menu"
          aria-label="Mobile navigation"
        >
          <ul className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href} role="none">
                <Link
                  href={link.href}
                  role="menuitem"
                  className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.href)
                      ? "text-saffron bg-cream"
                      : "text-text-secondary hover:text-navy hover:bg-cream"
                  }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li role="none" className="pt-2 border-t border-border-light">
              <div className="flex items-center justify-between px-4 py-3">
                <GoogleTranslate />
              </div>
            </li>
            {user ? (
              <>
                <li role="none">
                  <Link href="/profile" role="menuitem" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-text-secondary hover:text-navy hover:bg-cream">
                    <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-xs">
                      {user.displayName ? user.displayName.substring(0, 2).toUpperCase() : "BV"}
                    </span>
                    My Profile
                  </Link>
                </li>
                <li role="none">
                  <button onClick={() => logout()} role="menuitem" className="w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-danger hover:bg-red-50">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li role="none" className="flex flex-col gap-2 p-4">
                <Link href="/auth/login" className="w-full text-center py-3 rounded-xl border-2 border-border-light font-bold text-navy">Login</Link>
                <Link href="/auth/signup" className="w-full text-center py-3 rounded-xl bg-navy text-white font-bold">Register</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
