import { Outfit, Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/auth";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "BharatVote — Interactive Election Literacy Navigator",
    template: "%s | BharatVote",
  },
  description:
    "AI-powered, gamified web application that transforms complex Indian election procedures into an engaging, step-by-step journey — empowering every citizen with clarity, confidence, and civic pride.",
  keywords: [
    "Indian elections",
    "voter registration",
    "EVM simulator",
    "election literacy",
    "civic education",
    "BharatVote",
    "ECI",
    "democracy",
  ],
  authors: [{ name: "BharatVote Team" }],
  openGraph: {
    title: "BharatVote — Interactive Election Literacy Navigator",
    description:
      "Master the Indian electoral process through interactive simulations, AI assistance, and gamified learning.",
    type: "website",
    locale: "en_IN",
    siteName: "BharatVote",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoSans.variable}`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-screen flex flex-col bg-cream text-text-primary antialiased"
        suppressHydrationWarning
      >
        {/* Accessibility: Skip to main content */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
