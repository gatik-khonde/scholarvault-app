"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["600"] });
const sans = Inter({ subsets: ["latin"] });

/* ---------- Interactive vault background ---------- */
function VaultBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const NAVY = "11,31,75";
    const GOLD = "184,145,58";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W, H, cx, cy, R, raf;
    let mouse = { x: null, y: null };
    let tx = 0, ty = 0, px = 0, py = 0, spin = 0;
    let parts = [];
    let sparks = [];

    const rings = [
      { r: 0.3, ticks: 60, w: 1.2, dir: 1, c: GOLD, a: 0.55, len: 10 },
      { r: 0.42, ticks: 90, w: 1, dir: -1, c: NAVY, a: 0.28, len: 8 },
      { r: 0.55, ticks: 36, w: 1.4, dir: 1, c: NAVY, a: 0.22, len: 16 },
      { r: 0.7, ticks: 120, w: 1, dir: -1, c: GOLD, a: 0.35, len: 7 },
      { r: 0.88, ticks: 48, w: 1.2, dir: 1, c: NAVY, a: 0.16, len: 14 },
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      R = Math.max(W, H) * 0.62;
      const n = Math.min(70, Math.floor((W * H) / 18000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
      }));
    }

    function burst(x, y, n) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = Math.random() * 3 + 1;
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
      }
    }

    const onMove = (e) => {
      mouse = { x: e.clientX, y: e.clientY };
      tx = e.clientX / W - 0.5;
      ty = e.clientY / H - 0.5;
    };
    const onLeave = () => {
      mouse = { x: null, y: null };
      tx = 0;
      ty = 0;
    };
    const onDown = (e) => burst(e.clientX, e.clientY, 14);

    function drawRings() {
      ctx.save();
      ctx.translate(cx - px * 26, cy - py * 26);
      rings.forEach((g, k) => {
        const rad = g.r * R * ((Math.min(W, H) / Math.max(W, H)) * 0.55 + 0.45);
        const ang = spin * g.dir * (1 + k * 0.5) + tx * g.dir * (k + 1) * 0.5;
        ctx.save();
        ctx.rotate(ang);
        ctx.strokeStyle = `rgba(${g.c},${g.a})`;
        ctx.lineWidth = g.w;
        ctx.beginPath();
        ctx.arc(0, 0, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        for (let i = 0; i < g.ticks; i++) {
          const a = (i / g.ticks) * Math.PI * 2;
          const len = i % 5 === 0 ? g.len : g.len * 0.5;
          const c = Math.cos(a), s = Math.sin(a);
          ctx.moveTo(c * rad, s * rad);
          ctx.lineTo(c * (rad - len), s * (rad - len));
        }
        ctx.stroke();
        if (k % 2 === 0) {
          ctx.fillStyle = `rgba(${GOLD},.9)`;
          ctx.beginPath();
          ctx.arc(rad, 0, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      ctx.restore();
    }

    function drawParts() {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reduce) {
          p.x += p.vx + px * 0.3;
          p.y += p.vy + py * 0.3;
          if (mouse.x !== null) {
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 140 && d > 0) {
              p.x += (dx / d) * (140 - d) * 0.02;
              p.y += (dy / d) * (140 - d) * 0.02;
            }
          }
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
        }
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j];
          const ax = p.x - q.x, ay = p.y - q.y;
          const dd = ax * ax + ay * ay;
          if (dd < 14000) {
            ctx.strokeStyle = `rgba(${NAVY},${0.14 * (1 - dd / 14000)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        if (mouse.x !== null) {
          const mx = p.x - mouse.x, my = p.y - mouse.y;
          const md = mx * mx + my * my;
          if (md < 32000) {
            ctx.strokeStyle = `rgba(${GOLD},${0.55 * (1 - md / 32000)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${GOLD},.75)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawSparks() {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.life -= 0.02;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(217,185,104,${s.life})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2 * s.life + 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame() {
      px += (tx - px) * 0.05;
      py += (ty - py) * 0.05;
      spin += 0.0006;
      ctx.clearRect(0, 0, W, H);
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      grd.addColorStop(0, "#ffffff");
      grd.addColorStop(1, "#f3f1ea");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      drawRings();
      drawParts();
      drawSparks();
      if (!reduce) raf = requestAnimationFrame(frame);
    }

    resize();
    frame();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, display: "block" }}
    />
  );
}

/* Scoped styles (hover / focus states) so nothing depends on Tailwind or global CSS */
const css = `
.vl-input{width:100%;box-sizing:border-box;background:#fff;border:1px solid #cfd3de;border-radius:3px;color:#0b1f4b;font-size:.95rem;padding:10px 12px;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit}
.vl-input::placeholder{color:#9aa2b6}
.vl-input:focus{border-color:#b8913a;box-shadow:0 0 0 3px rgba(184,145,58,.25)}
.vl-tab{background:none;border:0;padding:11px 0;font-size:.92rem;font-weight:500;color:#3a4a73;cursor:pointer;position:relative;font-family:inherit}
.vl-tab:hover{color:#0b1f4b}
.vl-tab[aria-selected="true"]{color:#0b1f4b}
.vl-tab[aria-selected="true"]::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:#b8913a}
.vl-btn{width:100%;border:0;border-radius:3px;padding:12px;font-size:.95rem;font-weight:600;color:#fff;background:#0b1f4b;box-shadow:inset 0 -2px 0 #b8913a;cursor:pointer;transition:background .2s;font-family:inherit}
.vl-btn:hover{background:#13306e}
.vl-btn:disabled{opacity:.7;cursor:wait}
.vl-link{background:none;border:0;padding:0;font-size:.85rem;font-weight:600;color:#0b1f4b;text-decoration:underline;text-decoration-color:#b8913a;text-underline-offset:3px;cursor:pointer;font-family:inherit}
.vl-link:hover{color:#b8913a}
.vl-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);background:none;border:0;padding:8px;font-size:.78rem;font-weight:500;color:#3a4a73;cursor:pointer;font-family:inherit}
.vl-eye:hover{color:#0b1f4b}
.vl-btn:focus-visible,.vl-tab:focus-visible,.vl-link:focus-visible,.vl-eye:focus-visible{outline:2px solid #b8913a;outline-offset:2px}
`;

/* ---------- Login page ---------- */
export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [okMessage, setOkMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);

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

  function switchMode(m) {
    setMode(m);
    setMessage("");
    setOkMessage("");
  }

  const label = { display: "block", fontSize: "0.82rem", fontWeight: 500, marginBottom: 4 };

  return (
    <div
      className={sans.className}
      style={{ position: "fixed", inset: 0, zIndex: 50, overflowY: "auto", background: "#fff", color: "#0b1f4b" }}
    >
      <style>{css}</style>
      <VaultBackground />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
          boxSizing: "border-box",
        }}
      >
        <section
          style={{
            width: "min(400px, calc(100vw - 32px))",
            boxSizing: "border-box",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e4e0d4",
            borderTop: "3px solid #b8913a",
            borderRadius: 4,
            padding: "28px 28px 24px",
            boxShadow: "0 30px 70px -30px rgba(11,31,75,0.35)",
          }}
        >
          <svg viewBox="0 0 54 54" aria-hidden="true" style={{ width: 44, height: 44, display: "block", margin: "0 auto 12px" }}>
            <circle cx="27" cy="27" r="25" fill="#0b1f4b" />
            <circle cx="27" cy="27" r="25" fill="none" stroke="#d9b968" strokeWidth="1.5" />
            <circle cx="27" cy="27" r="19" fill="none" stroke="#b8913a" strokeWidth=".8" strokeDasharray="2 3" />
            <rect x="19" y="25" width="16" height="12" rx="2" fill="#d9b968" />
            <path d="M22 25v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#d9b968" strokeWidth="2.4" />
            <circle cx="27" cy="31" r="1.8" fill="#0b1f4b" />
          </svg>

          <h1
            className={serif.className}
            style={{ fontSize: "1.9rem", lineHeight: 1.1, fontWeight: 600, textAlign: "center", margin: "0 0 6px" }}
          >
            Log into your vault
          </h1>
          <p style={{ textAlign: "center", color: "#3a4a73", fontSize: "0.85rem", margin: "0 0 18px" }}>
            {mode === "login"
              ? "Welcome back to ScholarVault. Enter your details to open it."
              : "Set up your ScholarVault in under a minute."}
          </p>

          <div
            role="tablist"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #e4e0d4", marginBottom: 20 }}
          >
            <button
              type="button"
              role="tab"
              className="vl-tab"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
            >
              Log in
            </button>
            <button
              type="button"
              role="tab"
              className="vl-tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label htmlFor="email" style={label}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="vl-input"
              />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label htmlFor="password" style={label}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="vl-input"
                  style={{ paddingRight: 60 }}
                />
                <button
                  type="button"
                  className="vl-eye"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className="vl-btn">
              {busy ? "One moment..." : mode === "login" ? "Open my vault" : "Create my vault"}
            </button>
          </form>

          {message && (
            <p
              role="alert"
              style={{
                margin: "14px 0 0",
                fontSize: "0.85rem",
                color: "#a3262a",
                background: "rgba(163,38,42,0.06)",
                border: "1px solid rgba(163,38,42,0.25)",
                borderRadius: 3,
                padding: "8px 12px",
              }}
            >
              {message}
            </p>
          )}

          {okMessage && (
            <p
              role="status"
              style={{
                margin: "14px 0 0",
                fontSize: "0.85rem",
                color: "#0b1f4b",
                background: "rgba(184,145,58,0.12)",
                border: "1px solid rgba(184,145,58,0.45)",
                borderRadius: 3,
                padding: "8px 12px",
              }}
            >
              {okMessage}
            </p>
          )}

          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#3a4a73", margin: "16px 0 0" }}>
            {mode === "login" ? "New here? " : "Already have a vault? "}
            <button
              type="button"
              className="vl-link"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
