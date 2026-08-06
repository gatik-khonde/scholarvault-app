"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <header>
        <div className="nav-inner">
          <a href="/" className="brand">
            <img src="/alpaca.png" alt="ScholarVault alpaca" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span className="brand-name">ScholarVault</span>
          </a>
          <nav className="links">
            <a href="/#notes">Notes</a>
            <a href="/#quizzes">Quizzes</a>
            <a href="/#prompts">Writing Prompts</a>
            <a href="/#motions">Debate Motions</a>
            <a href="/#mcq">MCQ Archives</a>
            <a href="/about">About</a>
          </nav>
          <a href="/" className="owner-btn"><span>← Back to vault</span></a>
        </div>
      </header>

      <section className="hero" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr", textAlign: "center" }}>
          <div>
            <p className="eyebrow">About</p>
            <h1 style={{ fontSize: 40 }}>What is ScholarVault?</h1>
            <p className="lede" style={{ margin: "16px auto 0", maxWidth: 560 }}>
              A quiet, distraction-free study library built for the World Scholars Cup — keeping notes, quizzes, prompts, motions, and MCQ sets all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="about-content">
            <h2>The idea</h2>
            <p>
              ScholarVault was created to bring order to the chaos of WSC prep. Instead of scattering notes across shared drives, group chats, and random docs, everything lives here — organized by section, filterable by topic, and always one click away.
            </p>

            <h2>What's inside</h2>
            <ul>
              <li><strong>Published Notes</strong> — Topic write-ups and summaries, including linked Google Docs for longer material.</li>
              <li><strong>Topic Quizzes</strong> — Short self-check quizzes with linked Google Forms.</li>
              <li><strong>Writing Prompts</strong> — Collaborative Writing practice for framing, structure, and voice.</li>
              <li><strong>Debate Motions</strong> — Motions with room for case notes on both sides.</li>
              <li><strong>MCQ Archives</strong> — Full 120-question sets linked as Google Docs.</li>
            </ul>

            <h2>Who it's for</h2>
            <p>
              Whether you're a scholar preparing for your first round or a veteran drilling for Worlds, ScholarVault is designed to be the one tab you keep open the night before.
            </p>

            <h2>Prepare to excel</h2>
            <p>
              That's the motto. Not because winning is everything — but because being prepared lets you actually enjoy the round. ScholarVault is here to help with the first part.
            </p>

            <div style={{ marginTop: 36, textAlign: "center" }}>
              <Link href="/" className="btn btn-primary">Browse the vault →</Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <img src="/alpaca.png" alt="ScholarVault alpaca" className="footer-alpaca" style={{ width: 36 }} />
          <div className="brand-name" style={{ fontFamily: "'Fraunces',serif", color: "var(--dark-blue)" }}>ScholarVault</div>
          <p>Prepare to excel · a study library for the World Scholars Cup</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Alpaca icon by Freepik — [flaticon.com](https://flaticon.com)</p>
        </div>
      </footer>
    </>
  );
}
