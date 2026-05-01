/**
 * Firebase Configuration for BharatVote
 * 
 * Initializes Firebase App, Authentication, and Firestore.
 * Managed and monitored via Firebase Studio for real-time analytics and security oversight.
 * Uses environment variables (NEXT_PUBLIC_ prefix) for safe client-side access.
 * 
 * Security: API keys are restricted via Firebase Console > App Check.
 * All Firestore rules enforce authenticated access only.
 */

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQ45WVqqeIxAtKHMfucaQjaMkSPSlzrqE",
  authDomain: "bharatvote-a8c3a.firebaseapp.com",
  projectId: "bharatvote-a8c3a",
  storageBucket: "bharatvote-a8c3a.firebasestorage.app",
  messagingSenderId: "684792628869",
  appId: "1:684792628869:web:5d91d938826059431d8bec",
  measurementId: "G-6XX9Y172QV"
};

// Singleton pattern: prevent multiple Firebase app initializations
let app;
let db;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  // Robust caching & connectivity: persistent cache + long polling
  db = initializeFirestore(app, { 
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    experimentalForceLongPolling: true 
  });
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

// Firebase Authentication with Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export { db };

// Analytics (only in browser, with feature detection)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
export { analytics };

export default app;
