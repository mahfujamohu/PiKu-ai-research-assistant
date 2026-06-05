"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/api/auth/signup", {
        full_name: fullName,
        email,
        password,
      });

      localStorage.setItem("piku_token", response.data.access_token);

      setSuccess("Account created successfully. Redirecting to dashboard...");

      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } catch (err: any) {
      console.error(err);

      if (err.response?.status === 400) {
        setError("This email is already registered. Please login or use another email.");
      } else if (err.response?.status === 422) {
        setError("Invalid input. Please check your email and password.");
      } else {
        setError("Signup failed. Please check if backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B18] px-4 text-white">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-950/30"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DFB] to-[#00C2FF]">
            <Sparkles size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Create your PiKu account</h1>
            <p className="text-sm text-slate-400">
              Start your AI research workspace.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-[#0D1326] px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-[#0D1326] px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-[#0D1326] px-4 py-3 text-white outline-none placeholder:text-slate-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6D5DFB] to-[#00C2FF] py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}