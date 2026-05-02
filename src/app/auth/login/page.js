"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/profile");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      router.push("/profile");
    } catch (err) {
      setError("Google sign-in failed.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-border-light animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group justify-center mb-6">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 group-hover:scale-110 transition-transform border border-border-light">
              <Image src="/logo.png" alt="BharatVote Logo" width={40} height={40} className="w-full h-full object-contain" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-navy group-hover:text-saffron transition-colors">
              Bharat<span className="text-saffron">Vote</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-navy">Welcome Back</h1>
          <p className="text-text-secondary mt-2">Log in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-danger text-sm p-4 rounded-xl mb-6 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5" htmlFor="email">Email Address<span className="text-danger ml-1">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-semibold text-navy" htmlFor="password">Password<span className="text-danger ml-1">*</span></label>
              <Link href="/auth/forgot" className="text-xs font-semibold text-saffron hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-text-muted hover:text-navy transition-colors"
                tabIndex="-1"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : "Login to BharatVote"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center font-bold" aria-hidden="true">
            <div className="w-full border-t border-border-light"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-text-muted font-bold">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-border-light hover:border-navy hover:bg-cream py-3 rounded-xl transition-all font-semibold text-navy"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
            />
            <path
              fill="#FBBC05"
              d="M16.04 18.013c-1.09.636-2.4 1.01-3.834 1.01a7.077 7.077 0 0 1-6.94-5.373L1.24 16.765C3.198 20.717 7.27 23.415 12 23.415c3.127 0 5.918-1.018 8.164-2.845l-4.124-2.557Z"
            />
            <path
              fill="#4285F4"
              d="M23.415 12.01c0-.796-.064-1.568-.182-2.316h-11.233v4.382h6.398a5.437 5.437 0 0 1-2.357 3.565l4.124 2.556c2.409-2.222 3.8-5.487 3.8-9.187Z"
            />
            <path
              fill="#34A853"
              d="M5.266 14.245a7.067 7.067 0 0 1-.365-2.235c0-.782.136-1.53.365-2.235L1.24 6.65a11.996 11.996 0 0 0 0 10.73l4.026-3.135Z"
            />
          </svg>
          Google Account
        </button>

        <p className="text-center text-sm text-text-secondary mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-saffron font-bold hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
