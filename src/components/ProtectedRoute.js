"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isProfileReady, setIsProfileReady] = useState(false);

  // Hydration handling
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!loading && !user) {
      router.replace("/auth/login");
      return;
    }

    if (!loading && user && !isProfileReady) {
      const checkProfile = async () => {
        try {
          // Race against a 1.5s timeout so we don't block the UI forever on slow networks
          const fetchPromise = getDoc(doc(db, "users", user.uid));
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1500));
          
          const docSnap = await Promise.race([fetchPromise, timeoutPromise]);
          const isCompleted = docSnap.exists() && docSnap.data().profileCompleted === true;
          
          if (!isCompleted && pathname !== "/onboarding") {
            router.replace("/onboarding");
          }
          // Always set ready, even if redirecting, so we don't fetch twice
          setIsProfileReady(true);
        } catch (err) {
          if (err.message === "Timeout" || err.code === 'unavailable' || err.message?.toLowerCase().includes('offline')) {
            // Silently proceed for offline users
          } else {
            // Only log actual unexpected errors
          }
          setIsProfileReady(true); 
        }
      };
      checkProfile();
    }
  }, [user, loading, router, mounted, pathname, isProfileReady]);

  if (!mounted || loading || !user || (!isProfileReady && pathname !== "/onboarding")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
        <p className="text-navy font-bold text-lg animate-pulse">
          {!user ? "Authenticating..." : "Loading Profile..."}
        </p>
      </div>
    );
  }

  return children;
}
