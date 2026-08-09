"use client";

import { useEffect, useState, useCallback } from "react";

const SECTIONS = {
  notes: { label: "note", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/...", contentLabel: "Content (or leave blank if linking a Google Doc)", eyebrow: "Field Notes", title: "Published Notes", desc: "Topic write-ups and summaries — write inline or link a Google Doc for longer material.", empty: "No notes published yet. Add your first set of notes to get started." },
  quizzes: { label: "quiz", hasLink: true, linkLabel: "Google Form", linkPlaceholder: "https://docs.google.com/forms/...", contentLabel: "Description (what it covers, format, etc.)", eyebrow: "Scholar's Challenge", title: "Topic Quizzes", desc: "Short self-check quizzes on a single topic, including linked Google Forms.", empty: "No quizzes yet. Add a topic quiz or link a Google Form." },
  prompts: { label: "prompt", hasLink: false, contentLabel: "Prompt text", eyebrow: "Collaborative Writing", title: "Writing Prompts", desc: "Prompts to practice framing, structure, and voice under time pressure.", empty: "No writing prompts yet. Add one to start building the set." },
  motions: { label: "motion", hasLink: false, contentLabel: "Notes (case for / against, sources, etc.)", eyebrow: "Team Debate", title: "Debate Motions", desc: "Motions worth drilling — for and against, with room for your own case notes.", empty: "No motions yet. Add a motion worth drilling." },
  mcq: { label: "MCQ set", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/...", contentLabel: "Description (topics covered, notes)", eyebrow: "Scholar's Bowl · 120 Questions", title: "MCQ Archives", desc: "Full-length 120-question sets kept as Google Docs.", empty: "No MCQ sets yet. Link your first 120-question Google Doc." },
};

const SECTION_KEYS = Object.keys(SECTIONS);

function getGoogleDocEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://docs.google.com/document/d/${match[1]}/preview`;
  }
  return null;
}

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
            <a href="/about">About</a>
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
                      {item.content && <div className="snippet">{item.content}</div>}
                      {item.link && (
                        <div className="doc-link">↗ Open {cfg.linkLabel || "link"}</div>
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

       <section className="block alt" id="community" style={{ textAlign: "center", padding: "80px 24px" }}>
        <div className="wrap" style={{ maxWidth: 600, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Community</p>
          <h2 style={{ marginBottom: 14 }}>Join the ScholarVault Community</h2>
          <p className="desc" style={{ marginBottom: 28, maxWidth: 460, marginInline: "auto" }}>
            Connect with other World Scholar's Cup participants, share resources, debate motions, and prep together. Everyone's welcome.
          </p>
          <a
            href="https://discord.gg/F5mXCSHvE"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px", fontSize: 16 }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join the Discord
          </a>
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
          <div className="modal view-modal" style={{ position: "relative", maxWidth: viewItem.link ? 760 : 560 }}>
            <button className="close-x" onClick={() => setViewItem(null)}>&times;</button>
            <span className="topic-tag">{viewItem.topic}</span>
            <h3 style={{ marginBottom: 10 }}>{viewItem.title}</h3>
            {viewItem.link && !getGoogleDocEmbedUrl(viewItem.link) && (
              <div style={{ marginBottom: 14 }}>
                <a href={viewItem.link} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                  Open {SECTIONS[viewSection]?.linkLabel || "link"}
                </a>
              </div>
            )}
            {viewItem.link && getGoogleDocEmbedUrl(viewItem.link) && (
              <div className="doc-embed-wrap">
                <iframe
                  src={getGoogleDocEmbedUrl(viewItem.link)}
                  className="doc-embed"
                  allowFullScreen
                  title={viewItem.title}
                />
                <a href={viewItem.link} target="_blank" rel="noopener noreferrer" className="doc-embed-open">
                  Open in new tab ↗
                </a>
              </div>
            )}
            {viewItem.content && (
              <div className="body-text" style={{ marginTop: viewItem.link ? 14 : 0 }}>{viewItem.content}</div>
            )}
          </div>
        </div>
      )}

      <div className={`toast${toastMsg ? " show" : ""}`}>{toastMsg}</div>
    </>
  );
}
