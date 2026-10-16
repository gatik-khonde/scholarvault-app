"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"] });
const sans = Inter({ subsets: ["latin"] });

/* Scoped styles so nothing depends on Tailwind or global CSS */
const css = `
.mv-card{background:#fff;border:1px solid #e4e0d4;border-radius:4px;box-shadow:0 18px 40px -28px rgba(11,31,75,.35)}
.mv-stat{border-top:3px solid #b8913a}
.mv-logout{background:#fff;border:1px solid #cfd3de;border-radius:3px;color:#0b1f4b;padding:8px 16px;font-size:.85rem;font-weight:500;cursor:pointer;font-family:inherit;transition:border-color .2s,color .2s}
.mv-logout:hover{border-color:#b8913a;color:#b8913a}
.mv-link{display:block;text-decoration:none;color:#0b1f4b;background:#f8f6f1;border:1px solid #e4e0d4;border-left:3px solid #b8913a;border-radius:3px;padding:16px;transition:background .2s,transform .15s}
.mv-link:hover{background:#fff;transform:translateY(-2px)}
.mv-logout:focus-visible,.mv-link:focus-visible{outline:2px solid #b8913a;outline-offset:2px}
.mv-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.mv-grid2{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.mv-save-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;background:#f8f6f1;border:1px solid #e4e0d4;border-left:3px solid #b8913a;border-radius:3px;transition:background .2s}
.mv-save-row:hover{background:#fff}
.mv-open{color:#0b1f4b;font-size:.8rem;font-weight:600;text-decoration:none;border-bottom:1px solid #b8913a;padding-bottom:1px;white-space:nowrap}
.mv-open:hover{color:#b8913a}
.mv-remove{background:none;border:none;color:#3a4a73;font-size:.78rem;cursor:pointer;font-family:inherit;padding:4px 6px;border-radius:3px;white-space:nowrap}
.mv-remove:hover{color:#a33;background:#fdf1f1}
@media (max-width:600px){.mv-grid3,.mv-grid2{grid-template-columns:1fr}.mv-save-row{flex-direction:column;align-items:flex-start;gap:8px}}
@keyframes mv-pulse{0%,100%{opacity:1}50%{opacity:.45}}
@media (prefers-reduced-motion:reduce){.mv-pulse{animation:none!important}.mv-link,.mv-save-row{transition:none}}
`;

const shell = {
  position: "fixed",
  inset: 0,
  zIndex: 50,
  overflowY: "auto",
  background: "radial-gradient(circle at 50% 0%, #ffffff 0%, #f3f1ea 100%)",
  color: "#0b1f4b",
};

/* Faint vault-dial motif in the corner (static, keeps the dashboard calm) */
function DialMotif() {
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const len = i % 6 === 0 ? 14 : 7;
    return { x1: 300 + Math.cos(a) * 280, y1: 300 + Math.sin(a) * 280, x2: 300 + Math.cos(a) * (280 - len), y2: 300 + Math.sin(a) * (280 - len) };
  });
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      style={{ position: "absolute", top: -170, right: -170, width: 520, height: 520, opacity: 0.35, pointerEvents: "none" }}
    >
      <circle cx="300" cy="300" r="280" fill="none" stroke="#0b1f4b" strokeOpacity=".35" />
      <circle cx="300" cy="300" r="220" fill="none" stroke="#b8913a" strokeOpacity=".7" />
      <circle cx="300" cy="300" r="160" fill="none" stroke="#0b1f4b" strokeOpacity=".25" strokeDasharray="3 6" />
      <circle cx="300" cy="300" r="100" fill="none" stroke="#b8913a" strokeOpacity=".5" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#0b1f4b" strokeOpacity=".4" />
      ))}
    </svg>
  );
}

const SECTION_NAMES = {
  notes: "Note",
  quizzes: "Quiz",
  prompts: "Writing Prompt",
  motions: "Debate Motion",
  mcq: "MCQ Set",
};

export default function MySpacePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [savedRows, setSavedRows] = useState([]);
  const [removingKey, setRemovingKey] = useState("");

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
        return;
      }
      setEmail(data.session.user["email"]);
      setChecking(false);

      const { data: rows, error } = await supabase
        .from("saved_notes")
        .select("note_id, title, category, doc_url, created_at")
        .order("created_at", { ascending: false });
      if (!error && rows) setSavedRows(rows);
    }
    check();
  }, [router]);

  async function removeFromVault(noteId) {
    if (removingKey === noteId) return;
    setRemovingKey(noteId);
    const { error } = await supabase.from("saved_notes").delete().eq("note_id", noteId);
    if (!error) {
      setSavedRows((list) => list.filter((r) => r["note_id"] !== noteId));
    }
    setRemovingKey("");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (checking) {
    return (
      <main
        className={sans.className}
        style={{ ...shell, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <style>{css}</style>
        <p className="mv-pulse" style={{ color: "#3a4a73", animation: "mv-pulse 1.6s ease-in-out infinite" }}>
          Loading your vault...
        </p>
      </main>
    );
  }

  const initial = email ? email[0].toUpperCase() : "?";

  const noteCount = savedRows.filter((r) => r["note_id"].startsWith("notes:")).length;
  const quizCount = savedRows.filter((r) => r["note_id"].startsWith("quizzes:")).length;
  const totalSaved = savedRows.length;
  const progressPct = Math.min(100, Math.round((totalSaved / 20) * 100));

  const eyebrow = { color: "#3a4a73", fontSize: "0.82rem", fontWeight: 500, margin: "0 0 6px" };
  const bigNum = { fontSize: "2.2rem", fontWeight: 600, margin: 0, color: "#0b1f4b" };
  const small = { color: "#3a4a73", fontSize: "0.8rem", margin: "4px 0 0" };

  return (
    <main className={sans.className} style={shell}>
      <style>{css}</style>
      <DialMotif />

      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "40px 20px 56px", boxSizing: "border-box" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/alpaca.png" alt="ScholarVault" style={{ width: 32, height: 32, objectFit: "contain" }} />
            <span className={serif.className} style={{ fontSize: "1.35rem", fontWeight: 600 }}>
              ScholarVault
            </span>
          </div>
          <button onClick={handleLogout} className="mv-logout">
            Log out
          </button>
        </div>

        {/* Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#0b1f4b",
              color: "#d9b968",
              border: "2px solid #b8913a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <h1 className={serif.className} style={{ fontSize: "2.2rem", lineHeight: 1.05, fontWeight: 600, margin: 0 }}>
              My Vault
            </h1>
            <p style={{ ...small, margin: "4px 0 0", overflowWrap: "anywhere" }}>{email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mv-grid3" style={{ marginBottom: 24 }}>
          <div className="mv-card mv-stat" style={{ padding: 20 }}>
            <p style={eyebrow}>Notes</p>
            <p style={bigNum}>{noteCount}</p>
            <p style={small}>saved notes</p>
          </div>
          <div className="mv-card mv-stat" style={{ padding: 20 }}>
            <p style={eyebrow}>Quizzes</p>
            <p style={bigNum}>{quizCount}</p>
            <p style={small}>saved quizzes</p>
          </div>
          <div className="mv-card mv-stat" style={{ padding: 20 }}>
            <p style={eyebrow}>Total</p>
            <p style={bigNum}>{totalSaved}</p>
            <p style={small}>items in vault</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mv-card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 className={serif.className} style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
              Study progress
            </h2>
            <span style={{ color: "#b8913a", fontSize: "0.9rem", fontWeight: 600 }}>{progressPct}%</span>
          </div>
          <div style={{ height: 10, background: "#ece8dc", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.max(progressPct, 2)}%`,
                background: "linear-gradient(90deg, #b8913a, #d9b968)",
                borderRadius: 999,
                transition: "width .4s ease",
              }}
            />
          </div>
          <p style={{ ...small, marginTop: 12 }}>Save 20 items to your vault to fill this bar.</p>
        </div>

        {/* Saved items */}
        <div className="mv-card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 className={serif.className} style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 14px" }}>
            Saved to your vault
          </h2>
          {savedRows.length === 0 ? (
            <p style={{ ...small, margin: 0 }}>
              Nothing saved yet. Hit the star Save button on any note, quiz, or motion to stash it here.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {savedRows.map((r) => {
                const section = (r["note_id"].split(":")[0] || "").toLowerCase();
                const kindLabel = SECTION_NAMES[section] || "Item";
                const dateText = new Date(r["created_at"]).toLocaleDateString(undefined, { month: "short", day: "numeric" });
                return (
                  <div key={r["note_id"]} className="mv-save-row">
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.72rem", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#7a6a3f" }}>
                        {kindLabel}{r.category ? ` · ${r.category}` : ""}
                      </p>
                      <p style={{ margin: "4px 0 0", fontWeight: 600, fontSize: "0.95rem", overflowWrap: "anywhere" }}>
                        {r.title || "Untitled"}
                      </p>
                      <p style={{ ...small, margin: "2px 0 0", fontSize: "0.74rem" }}>Saved {dateText}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      {r.doc_url && (
                        <a href={r.doc_url} target="_blank" rel="noopener noreferrer" className="mv-open">
                          Open ↗
                        </a>
                      )}
                      <button
                        onClick={() => removeFromVault(r["note_id"])}
                        className="mv-remove"
                        disabled={removingKey === r["note_id"]}
                        aria-label="Remove from your vault"
                      >
                        {removingKey === r["note_id"] ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Continue */}
        <div className="mv-card" style={{ padding: 24 }}>
          <h2 className={serif.className} style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 14px" }}>
            Continue where you left off
          </h2>
          <div className="mv-grid2">
            <a href="/" className="mv-link">
              <p style={{ fontWeight: 600, fontSize: "0.92rem", margin: 0 }}>Curriculum</p>
              <p style={small}>Go back to the resources</p>
            </a>
            <a href="/" className="mv-link">
              <p style={{ fontWeight: 600, fontSize: "0.92rem", margin: 0 }}>Writing Prompts</p>
              <p style={small}>Practice your essays</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
