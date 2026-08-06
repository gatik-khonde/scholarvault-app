"use client";

import { useEffect, useState, useCallback } from "react";

const SECTIONS = {
  notes: { label: "note", hasLink: false, contentLabel: "Content", eyebrow: "Field Notes", title: "Published Notes", desc: "Topic write-ups and summaries, organized the way you'd want to revise them the night before a round.", empty: "No notes published yet. Add your first set of notes to get started." },
  quizzes: { label: "quiz", hasLink: true, linkLabel: "Google Form", linkPlaceholder: "https://docs.google.com/forms/...", contentLabel: "Description (what it covers, format, etc.)", eyebrow: "Scholar's Challenge", title: "Topic Quizzes", desc: "Short self-check quizzes on a single topic, including linked Google Forms.", empty: "No quizzes yet. Add a topic quiz or link a Google Form." },
  prompts: { label: "prompt", hasLink: false, contentLabel: "Prompt text", eyebrow: "Collaborative Writing", title: "Writing Prompts", desc: "Prompts to practice framing, structure, and voice under time pressure.", empty: "No writing prompts yet. Add one to start building the set." },
  motions: { label: "motion", hasLink: false, contentLabel: "Notes (case for / against, sources, etc.)", eyebrow: "Team Debate", title: "Debate Motions", desc: "Motions worth drilling — for and against, with room for your own case notes.", empty: "No motions yet. Add a motion worth drilling." },
  mcq: { label: "MCQ set", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/...", contentLabel: "Description (topics covered, notes)", eyebrow: "Scholar's Bowl · 120 Questions", title: "MCQ Archives", desc: "Full-length 120-question sets kept as Google Docs.", empty: "No MCQ sets yet. Link your first 120-question Google Doc." },
};

const SECTION_KEYS = Object.keys(SECTIONS);

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [data, setData] = useState({});
  const [filters, setFilters] = useState({});
  const [toastMsg, setToastMsg] = useState("");

  const [passOpen, setPassOpen] = useState(false);
  const [passValue, setPassValue] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState(null);
  const [formFields, setFormFields] = useState({ title: "", topic: "", content: "", link: "" });

  const [viewItem, setViewItem] = useState(null);
  const [viewSection, setViewSection] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  }, []);

  const loadSection = useCallback(async (section) => {
    const res = await fetch(`/api/data/${section}`);
    const json = await res.json();
    setData((prev) => ({ ...prev, [section]: json.items || [] }));
  }, []);

  useEffect(() => {
    SECTION_KEYS.forEach((s) => {
      loadSection(s);
      setFilters((prev) => ({ ...prev, [s]: "All" }));
    });
    fetch("/api/session")
      .then((r) => r.json())
      .then((j) => setIsOwner(!!j.isOwner))
      .catch(() => {});
  }, [loadSection]);

  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    setIsOwner(false);
    showToast("Signed out. Viewing as a visitor.");
  }

  async function handleSignIn() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passValue }),
    });
    setPassOpen(false);
    setPassValue("");
    if (res.ok) {
      setIsOwner(true);
      showToast("Signed in — you can now publish and remove items.");
    } else {
      showToast("Incorrect passcode.");
    }
  }

  function openAddForm(section) {
    if (!isOwner) {
      showToast("Sign in as the owner to publish new items.");
      return;
    }
    setFormSection(section);
    setFormFields({ title: "", topic: "", content: "", link: "" });
    setFormOpen(true);
  }

  async function submitAddForm() {
    const cfg = SECTIONS[formSection];
    const title = formFields.title.trim();
    const topic = formFields.topic.trim();
    if (!title || !topic) {
      showToast("Please add a title and topic.");
      return;
    }
    const res = await fetch(`/api/data/${formSection}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        topic,
        content: formFields.content.trim(),
        link: cfg.hasLink ? formFields.link.trim() : "",
      }),
    });
    setFormOpen(false);
    if (res.ok) {
      showToast("Published to the vault.");
      loadSection(formSection);
    } else {
      const j = await res.json().catch(() => ({}));
      showToast(j.error || "Could not save — please try again.");
    }
  }

  async function deleteItem(section, id) {
    const res = await fetch(`/api/data/${section}/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Removed.");
      loadSection(section);
    } else {
      showToast("Could not remove — please try again.");
    }
  }

  function openView(section, item) {
    setViewSection(section);
    setViewItem(item);
  }

  return (
    <>
      <header>
        <div className="nav-inner">
          <a href="#top" className="brand">
            <img src="/alpaca.png" alt="ScholarVault alpaca" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span className="brand-name">ScholarVault</span>
          </a>
          <nav className="links">
            <a href="#notes">Notes</a>
            <a href="#quizzes">Quizzes</a>
            <a href="#prompts">Writing Prompts</a>
            <a href="#motions">Debate Motions</a>
            <a href="#mcq">MCQ Archives</a>
          </nav>
          <button
            className={`owner-btn${isOwner ? " on" : ""}`}
            onClick={() => (isOwner ? handleSignOut() : setPassOpen(true))}
          >
            <span>{isOwner ? "Editing as owner" : "Owner sign in"}</span>
          </button>
        </div>
      </header>

      <div className="hero" id="top">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">World Scholars Cup study library</p>
            <h1>Notes, prompts, and<br />motions — all in one vault.</h1>
            <p className="lede">A quiet, distraction-free home for everything you&apos;re preparing: topic notes, Scholar&apos;s Challenge quizzes, Collaborative Writing prompts, Team Debate motions, and full 120-question MCQ sets.</p>
            <p className="slogan">Prepare to excel</p>
            <div className="hero-ctas">
              <a href="#notes" className="btn btn-primary">Browse the vault</a>
              <a href="#mcq" className="btn btn-ghost">Jump to MCQ archives</a>
            </div>
          </div>
          <div className="seal-wrap">
            <svg viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="104" fill="var(--dark-blue)" />
              <circle cx="110" cy="110" r="104" fill="none" stroke="var(--gold)" strokeWidth="2.5" />
              <circle cx="110" cy="110" r="93" fill="none" stroke="var(--gold)" strokeWidth="1" strokeDasharray="1 5" />
              <image href="/alpaca.png" x="60" y="52" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
              <text x="110" y="196" textAnchor="middle" fill="var(--gold-soft)" fontFamily="IBM Plex Mono, monospace" fontSize="9" letterSpacing="2">PREPARE TO EXCEL</text>
            </svg>
          </div>
        </div>
      </div>

      {SECTION_KEYS.map((key, i) => {
        const cfg = SECTIONS[key];
        const items = data[key] || [];
        const topics = [...new Set(items.map((it) => it.topic))].sort();
        const filter = filters[key] || "All";
        const visible = (filter === "All" ? items : items.filter((it) => it.topic === filter))
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt);

        return (
          <section className={`block${i % 2 === 1 ? " alt" : ""}`} id={key} key={key}>
            <div className="wrap">
              <div className="block-head">
                <div>
                  <p className="eyebrow">{cfg.eyebrow}</p>
                  <h2>{cfg.title}</h2>
                  <p className="desc">{cfg.desc}</p>
                </div>
                <button className="add-btn" onClick={() => openAddForm(key)}>+ Add {cfg.label}</button>
              </div>

              {topics.length > 0 && (
                <div className="filters">
                  {["All", ...topics].map((t) => (
                    <button
                      key={t}
                      className={`chip${filter === t ? " active" : ""}`}
                      onClick={() => setFilters((prev) => ({ ...prev, [key]: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid">
                {visible.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                    <img src="/alpaca.png" alt="" style={{ width: 44, height: 44, marginBottom: 10, opacity: 0.55 }} />
                    <p>{cfg.empty}</p>
                  </div>
                ) : (
                  visible.map((item) => (
                    <div className="card" key={item.id} onClick={() => openView(key, item)}>
                      {isOwner && (
                        <button
                          className="del-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(key, item.id);
                          }}
                        >
                          Remove
                        </button>
                      )}
                      <span className="topic-tag">{item.topic}</span>
                      <h3>{item.title}</h3>
                      {cfg.hasLink ? (
                        <div className="doc-link">↗ Open {cfg.linkLabel}</div>
                      ) : (
                        <div className="snippet">{item.content}</div>
                      )}
                      <div className="meta">
                        <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        );
      })}

      <footer>
        <div className="wrap">
          <img src="/alpaca.png" alt="ScholarVault alpaca" className="footer-alpaca" style={{ width: 36 }} />
          <div className="brand-name" style={{ fontFamily: "'Fraunces',serif", color: "var(--dark-blue)" }}>ScholarVault</div>
          <p>Prepare to excel · a study library for the World Scholars Cup</p>
          <p style={{ fontSize: 11, opacity: 0.7 }}>Alpaca icon by Freepik — flaticon.com</p>
        </div>
      </footer>

      {passOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setPassOpen(false)}>
          <div className="modal" style={{ maxWidth: 360 }}>
            <h3 style={{ marginBottom: 4 }}>Owner sign in</h3>
            <p className="modal-sub">Enter the owner passcode to enable publishing and removing items.</p>
            <div className="field">
              <label>Passcode</label>
              <input
                type="password"
                autoFocus
                value={passValue}
                onChange={(e) => setPassValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setPassOpen(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={handleSignIn}>Sign in</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && formSection && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <div className="modal">
            <h3>Add {SECTIONS[formSection].label}</h3>
            <p className="modal-sub">This will be published for anyone visiting the vault.</p>
            <div className="field">
              <label>Title</label>
              <input value={formFields.title} onChange={(e) => setFormFields((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="field">
              <label>Topic</label>
              <input
                value={formFields.topic}
                onChange={(e) => setFormFields((f) => ({ ...f, topic: e.target.value }))}
                list="topic-suggestions"
                placeholder="e.g. Biology, Literature, Special Area"
              />
              <datalist id="topic-suggestions">
                <option value="Literature & Media" />
                <option value="Science & Technology" />
                <option value="History" />
                <option value="Social Studies" />
                <option value="Special Area" />
                <option value="Art & Music" />
                <option value="General" />
              </datalist>
            </div>
            {SECTIONS[formSection].hasLink && (
              <div className="field">
                <label>{SECTIONS[formSection].linkLabel} link</label>
                <input
                  type="url"
                  value={formFields.link}
                  onChange={(e) => setFormFields((f) => ({ ...f, link: e.target.value }))}
                  placeholder={SECTIONS[formSection].linkPlaceholder}
                />
              </div>
            )}
            <div className="field">
              <label>{SECTIONS[formSection].contentLabel}</label>
              <textarea value={formFields.content} onChange={(e) => setFormFields((f) => ({ ...f, content: e.target.value }))} />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setFormOpen(false)}>Cancel</button>
              <button type="button" className="btn-save" onClick={submitAddForm}>Publish</button>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setViewItem(null)}>
          <div className="modal view-modal" style={{ position: "relative" }}>
            <button className="close-x" onClick={() => setViewItem(null)}>&times;</button>
            <span className="topic-tag">{viewItem.topic}</span>
            <h3 style={{ marginBottom: 10 }}>{viewItem.title}</h3>
            {viewItem.link && (
              <div style={{ marginBottom: 14 }}>
                <a href={viewItem.link} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  Open {SECTIONS[viewSection]?.linkLabel || "link"}
                </a>
              </div>
            )}
            <div className="body-text">{viewItem.content}</div>
          </div>
        </div>
      )}

      <div className={`toast${toastMsg ? " show" : ""}`}>{toastMsg}</div>
    </>
  );
}
