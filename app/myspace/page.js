"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MySpacePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user["email"]);
      setChecking(false);
    }
    check();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse">Loading your vault...</p>
      </main>
    );
  }

  const initial = email ? email[0].toUpperCase() : "?";

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-slate-100 p-6">
      <div className="max-w-3xl mx-auto py-10">

        <div className="flex items-center justify-between mb-10">
          <p className="text-sm text-slate-400">ScholarVault</p>
          <button
            onClick={handleLogout}
            className="bg-slate-800/80 hover:bg-slate-700 rounded-lg px-4 py-2 text-sm transition"
          >
            Log out
          </button>
        </div>

        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-900">
            {initial}
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Vault</h1>
            <p className="text-slate-400 text-sm">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Notes</p>
            <p className="text-3xl font-bold text-indigo-400">0</p>
            <p className="text-slate-500 text-xs mt-1">saved notes</p>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Quizzes</p>
            <p className="text-3xl font-bold text-indigo-400">0</p>
            <p className="text-slate-500 text-xs mt-1">completed</p>
          </div>
          <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Streak</p>
            <p className="text-3xl font-bold text-indigo-400">1</p>
            <p className="text-slate-500 text-xs mt-1">day strong</p>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Study progress</h2>
            <span className="text-indigo-400 text-sm font-semibold">0%</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[3%] bg-gradient-to-r from-indigo-500 to-purple-400 rounded-full"></div>
          </div>
          <p className="text-slate-500 text-xs mt-3">
            Complete quizzes and save notes to fill this bar.
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800">
          <h2 className="text-lg font-semibold mb-2">Continue where you left off</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="/" className="bg-slate-800/70 hover:bg-slate-700 rounded-lg p-4 transition">
              <p className="font-semibold text-sm">Curriculum</p>
              <p className="text-slate-400 text-xs mt-1">Go back to the resources</p>
            </a>
            <a href="/" className="bg-slate-800/70 hover:bg-slate-700 rounded-lg p-4 transition">
              <p className="font-semibold text-sm">Writing Prompts</p>
              <p className="text-slate-400 text-xs mt-1">Practice your essays</p>
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}
