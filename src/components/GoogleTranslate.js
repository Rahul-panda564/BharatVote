"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,hi,bn,te,mr,ta,gu,kn,ml,pa,as,or", // Major Indian languages
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div id="google_translate_element" className="google-translate-container"></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <style jsx global>{`
        .google-translate-container {
          min-width: 160px;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          padding: 4px 8px !important;
          border-radius: var(--radius-button) !important;
          font-family: var(--font-sans) !important;
          font-size: 0.75rem !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
        }
        .goog-te-gadget-simple img {
          display: none !important;
        }
        .goog-te-gadget-simple span {
          color: var(--color-navy) !important;
          font-weight: 600 !important;
        }
        .goog-te-menu-value span:nth-child(3),
        .goog-te-menu-value span:nth-child(5) {
          display: none !important;
          border-left: none !important;
        }
        /* Hide Google Translate Banner */
        .goog-te-banner-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
      `}</style>
    </div>
  );
}
