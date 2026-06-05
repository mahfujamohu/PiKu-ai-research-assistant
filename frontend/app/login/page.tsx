"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("piku_token", response.data.access_token);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B18] px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-cyan-950/30"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DFB] to-[#00C2FF]">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back to PiKu</h1>
            <p className="text-sm text-slate-400">
              Continue your research workspace.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-[#0D1326] px-4 py-3 outline-none placeholder:text-slate-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl border border-white/10 bg-[#0D1326] px-4 py-3 outline-none placeholder:text-slate-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#6D5DFB] to-[#00C2FF] py-3 font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to PiKu?{" "}
          <Link href="/signup" className="text-cyan-400">
            Create account
          </Link>
        </p>
      </form>
    </main>
  );
}