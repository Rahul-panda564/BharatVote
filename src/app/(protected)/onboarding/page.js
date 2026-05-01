"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function OnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    fullName: "",
    state: "",
    district: "",
    constituency: "",
  });
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        setFormData((prev) => ({ ...prev, fullName: user.displayName }));
      }
      
      const checkProfile = async () => {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists() && docSnap.data().profileCompleted) {
            router.replace("/profile");
          } else {
            setChecking(false);
          }
        } catch (err) {
          if (err.code === 'unavailable' || err.message?.includes('offline')) {
            console.warn("Firestore is offline. Allowing setup to proceed locally.");
          } else {
            console.error("Error checking profile in onboarding:", err);
          }
          setChecking(false);
        }
      };
      checkProfile();
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email,
        profileCompleted: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setTimeout(() => {
        router.push("/profile");
      }, 500);
    } catch (err) {
      console.error("Error saving profile", err);
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full card p-8 border-t-4 border-t-saffron shadow-xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-navy mb-2">Complete Your Profile</h1>
          <p className="text-text-secondary">Please provide a few details so we can tailor your BharatVote experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5" htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Aarav Sharma"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5" htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select State</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5" htmlFor="district">District</label>
              <input
                id="district"
                name="district"
                type="text"
                value={formData.district}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g. South Delhi"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5" htmlFor="constituency">Parliamentary Constituency</label>
            <input
              id="constituency"
              name="constituency"
              type="text"
              value={formData.constituency}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. New Delhi"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 mt-6 text-lg"
          >
            {loading ? "Saving Profile..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
