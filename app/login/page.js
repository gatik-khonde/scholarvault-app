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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error: errorMsg } = await supabase.auth.signUp({ email, password });
      if (errorMsg) {
                setMessage("Sign-up failed: " + String(errorMsg));
        setLoading(false);
        return;
      }
      setMessage("Check your email to confirm your account, then log in!");
      setLoading(false);
    } else {
      const { error: errorMsg } = await supabase.auth.signInWithPassword({ email, password });
      if (errorMsg) {
                setMessage("Login failed: " + String(errorMsg));
        setLoading(false);
        return;
      }
      router.push("/myspace");
      router.refresh();
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Save your notes and track your progress
        </p>

        <form onSubmit={handleSubmit} className="bg-slate-900 rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your email here"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="At least 6 characters"
            />
          </div>

          {message && <p className="text-sm text-indigo-300">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg py-2.5 font-semibold transition"
          >
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="text-center mt-4 text-slate-400">
          {mode === "login" ? (
            <>No account{" "}
              <button onClick={() => setMode("signup")} className="text-indigo-400 hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account{" "}
              <button onClick={() => setMode("login")} className="text-indigo-400 hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
