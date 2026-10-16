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
      { r: 0.30, ticks: 60, w: 1.2, dir: 1, c: GOLD, a: 0.55, len: 10 },
      { r: 0.42, ticks: 90, w: 1, dir: -1, c: NAVY, a: 0.28, len: 8 },
      { r: 0.55, ticks: 36, w: 1.4, dir: 1, c: NAVY, a: 0.22, len: 16 },
      { r: 0.70, ticks: 120, w: 1, dir: -1, c: GOLD, a: 0.35, len: 7 },
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
    const onLeave = () => { mouse = { x: null, y: null }; tx = 0; ty = 0; };
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
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.96; s.vy *= 0.96;
        s.life -= 0.02;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
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

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 w-full h-full z-0" />;
}

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

  const tab = (active) =>
    `relative py-3 text-[0.95rem] font-medium transition-colors ${
      active ? "text-[#0b1f4b]" : "text-[#3a4a73] hover:text-[#0b1f4b]"
    }`;

  const input =
    "w-full bg-white border border-[#cfd3de] rounded-[3px] px-[14px] py-3 text-base text-[#0b1f4b] outline-none transition placeholder:text-[#9aa2b6] focus:border-[#b8913a] focus:ring-[3px] focus:ring-[#b8913a]/25";

  return (
    <div className={`${sans.className} relative min-h-screen bg-white text-[#0b1f4b]`}>
      <VaultBackground />

      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6">
        <section className="w-full max-w-[440px] bg-white/95 backdrop-blur-[6px] border border-[#e4e0d4] border-t-[3px] border-t-[#b8913a] rounded px-9 pt-10 pb-8 max-[480px]:px-[22px] shadow-[0_30px_70px_-30px_rgba(11,31,75,0.35)]">
          {/* Seal */}
          <svg className="w-[54px] h-[54px] mx-auto mb-[18px] block" viewBox="0 0 54 54" aria-hidden="true">
            <circle cx="27" cy="27" r="25" fill="#0b1f4b" />
            <circle cx="27" cy="27" r="25" fill="none" stroke="#d9b968" strokeWidth="1.5" />
            <circle cx="27" cy="27" r="19" fill="none" stroke="#b8913a" strokeWidth=".8" strokeDasharray="2 3" />
            <rect x="19" y="25" width="16" height="12" rx="2" fill="#d9b968" />
            <path d="M22 25v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#d9b968" strokeWidth="2.4" />
            <circle cx="27" cy="31" r="1.8" fill="#0b1f4b" />
          </svg>

          <h1 className={`${serif.className} text-center text-[2.3rem] max-[480px]:text-[2rem] leading-[1.05] font-semibold mb-2`}>
            Log into your vault
          </h1>
          <p className="text-center text-[#3a4a73] text-[0.92rem] mb-[26px]">
            {mode === "login"
              ? "Welcome back to ScholarVault. Enter your details to open it."
              : "Set up your ScholarVault in under a minute."}
          </p>

          {/* Tabs */}
          <div className="grid grid-cols-2 border-b border-[#e4e0d4] mb-6" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
              className={tab(mode === "login")}
            >
              Log in
              {mode === "login" && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#b8913a]" />}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={tab(mode === "signup")}
            >
              Create account
              {mode === "signup" && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#b8913a]" />}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-[18px]">
              <label htmlFor="email" className="block text-[0.85rem] font-medium mb-1.5">
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
                className={input}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-[0.85rem] font-medium mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`${input} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-[0.8rem] font-medium text-[#3a4a73] hover:text-[#0b1f4b]"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[3px] py-3.5 text-base font-semibold bg-[#0b1f4b] text-white shadow-[inset_0_-2px_0_#b8913a] transition hover:bg-[#13306e] active:translate-y-px disabled:opacity-70 disabled:cursor-wait"
            >
              {busy ? "One moment..." : mode === "login" ? "Open my vault" : "Create my vault"}
            </button>
          </form>

          {message && (
            <p role="alert" className="mt-4 text-sm text-[#a3262a] bg-[#a3262a]/5 border border-[#a3262a]/25 rounded-[3px] px-4 py-3">
              {message}
            </p>
          )}

          {okMessage && (
            <p role="status" className="mt-4 text-sm text-[#0b1f4b] bg-[#b8913a]/10 border border-[#b8913a]/40 rounded-[3px] px-4 py-3">
              {okMessage}
            </p>
          )}

          <p className="text-center text-[0.88rem] text-[#3a4a73] mt-[22px]">
            {mode === "login" ? "New here? " : "Already have a vault? "}
            <button
              type="button"
              onClick={() => switchMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-[#0b1f4b] underline decoration-[#b8913a] underline-offset-[3px] hover:text-[#b8913a]"
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}
