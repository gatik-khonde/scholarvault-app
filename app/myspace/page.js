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
        <p className="text-slate-400">Loading your space...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Space</h1>
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-slate-700 rounded-lg px-4 py-2 text-sm transition"
          >
            Log out
          </button>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 mb-6">
          <p className="text-slate-400 text-sm mb-1">Signed in as</p>
          <p className="text-lg font-semibold">{email}</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2">Coming soon</h2>
          <p className="text-slate-400 text-sm">
            Your saved notes and quiz progress will appear here.
          </p>
        </div>
      </div>
    </main>
  );
}
