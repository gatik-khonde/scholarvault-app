"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setOkMessage("");
    setBusy(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      setBusy(false);
      if (signUpError) {
        setMessage("Sign-up failed: " + String(signUpError));
        return;
      }
      setOkMessage("Account created! Check your inbox for a confirmation email, then log in.");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    setBusy(false);
    if (signInError) {
      setMessage("Login failed: " + String(signInError));
      return;
    }
    router.replace("/myspace");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-sm text-slate-400 tracking-wide uppercase">ScholarVault</p>
          <h1 className="text-3xl font-bold mt-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-2">
            Log in to open your vault, or create a new one.
          </p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur rounded-2xl p-8 border border-slate-800 shadow-xl">

          <div className="grid grid-cols-2 gap-2 bg-slate-800/60 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setMode("login"); setMessage(""); setOkMessage(""); }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                mode === "login"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => { setMode("signup"); setMessage(""); setOkMessage(""); }}
              className={`rounded-lg py-2 text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your email"
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 transition placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="at least 6 characters"
                className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 transition placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 disabled:opacity-60 rounded-xl py-3 text-sm font-semibold transition shadow-lg shadow-indigo-900/50"
            >
              {busy ? "One moment..." : mode === "login" ? "Open my vault" : "Create my vault"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl px-4 py-3">
              {message}
            </p>
          )}

          {okMessage && (
            <p className="mt-4 text-sm text-emerald-400 bg-emerald-950/40 border border-emerald-900/50 rounded-xl px-4 py-3">
              {okMessage}
            </p>
          )}

        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          By signing up you agree to use ScholarVault for good, not evil.
        </p>

      </div>
    </main>
  );
}
