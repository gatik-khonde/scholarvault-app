"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const SECTION_META = {
  notes: {
    eyebrow: "Field Notes",
    title: "Published Notes",
    desc: "Topic write-ups and summaries — write inline or link a Google Doc for longer material.",
    linkLabel: "Google Doc",
    empty: "No notes published yet. Check back soon.",
  },
  quizzes: {
    eyebrow: "Scholar's Challenge",
    title: "Topic Quizzes",
    desc: "Short self-check quizzes on a single topic, including linked Google Forms.",
    linkLabel: "Google Form",
    empty: "No quizzes yet. Check back soon.",
  },
  prompts: {
    eyebrow: "Collaborative Writing",
    title: "Writing Prompts",
    desc: "Prompts to practice framing, structure, and voice under time pressure.",
    linkLabel: "Google Doc",
    empty: "No writing prompts yet. Check back soon.",
  },
  motions: {
    eyebrow: "Team Debate",
    title: "Debate Motions",
    desc: "Motions worth drilling — for and against, with room for your own case notes.",
    linkLabel: "Google Doc",
    empty: "No motions yet. Check back soon.",
  },
};

const NAV = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/prompts", label: "Writing Prompts" },
  { href: "/motions", label: "Debate Motions" },
  { href: "/about", label: "About" },
  { href: "/myspace", label: "My Vault" },
];

function getGoogleDocEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/docs\.google\.com\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return "https://docs.google.com/document/d/" + match[1] + "/preview";
  }
  return null;
}

export default function SectionClient({ section }) {
  const router = useRouter();
  const cfg = SECTION_META[section];
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("All");
  const [toastMsg, setToastMsg] = useState("");
  const [savedIds, setSavedIds] = useState([]);
  const [savingKey, setSavingKey] = useState("");
  const [viewItem, setViewItem] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4500);
  }, []);

  useEffect(() => {
    fetch(`/api/data/${section}`)
      .then((r) => r.json())
      .then((j) => setItems(j.items || []))
      .catch(() => setItems([]));

    supabase.auth.getSession().then(({ data: s }) => {
      if (!s || !s.session) return;
      supabase
        .from("saved_notes")
        .select("note_id")
        .then(({ data: rows }) => {
          if (rows) setSavedIds(rows.map((r) => r.note_id));
        });
    });
  }, [section]);

  async function toggleSave(e, item) {
    e.stopPropagation();
    const { data: s } = await supabase.auth.getSession();
    if (!s || !s.session) {
      showToast("Log in to save items to your vault.");
      setTimeout(() => router.push("/login"), 900);
      return;
    }
    const noteKey = `${section}:${item.id}`;
    if (savingKey === noteKey) return;
    setSavingKey(noteKey);

    if (savedIds.includes(noteKey)) {
      const { error } = await supabase.from("saved_notes").delete().eq("note_id", noteKey);
      if (error) {
        showToast("Could not remove — please try again.");
      } else {
        setSavedIds((ids) => ids.filter((x) => x !== noteKey));
        showToast("Removed from your vault.");
      }
    } else {
      const { error: insertErr } = await supabase.from("saved_notes").insert({
        user_id: s.session.user.id,
        note_id: noteKey,
        title: item.title,
        category: item.topic || "",
        doc_url: item.link || "",
      });
      if (insertErr) {
        showToast("Save failed: " + insertErr["message"]);
      } else {
        setSavedIds((ids) => [...ids, noteKey]);
        showToast("Saved to your vault.");
      }
    }
    setSavingKey("");
  }

  function saveButton(item) {
    const noteKey = `${section}:${item.id}`;
    const isSaved = savedIds.includes(noteKey);
    return (
      <button
        type="button"
        onClick={(e) => toggleSave(e, item)}
        disabled={savingKey === noteKey}
        aria-pressed={isSaved}
        aria-label={isSaved ? "Remove from your vault" : "Save to your vault"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          cursor: savingKey === noteKey ? "wait" : "pointer",
          fontFamily: "inherit",
          fontSize: 12.5,
          fontWeight: 600,
          lineHeight: 1,
          padding: "7px 12px",
          borderRadius: 999,
          border: "1px solid var(--gold, #b8913a)",
          background: isSaved ? "var(--dark-blue, #0b1f4b)" : "#fff",
          color: isSaved ? "var(--gold-soft, #d9b968)" : "var(--dark-blue, #0b1f4b)",
        }}
      >
        <span aria-hidden="true">{isSaved ? "★" : "☆"}</span>
        {isSaved ? "Saved" : "Save"}
      </button>
    );
  }

  const topics = items ? [...new Set(items.map((it) => it.topic))].sort() : [];
  const visible = items
    ? (filter === "All" ? items : items.filter((it) => it.topic === filter))
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
    : [];

  return (
    <>
      <header>
        <div className="nav-inner">
          <a href="/" className="brand">
            <img src="/alpaca.png" alt="ScholarVault alpaca" style={{ width: 34, height: 34, objectFit: "contain" }} />
            <span className="brand-name">ScholarVault</span>
          </a>
          <nav className="links">
            {NAV.map((l) => (
              <a key={l.href} href={l.href}>{l.label}</a>
            ))}
          </nav>
        </div>
      </header>

      <section className="block" id={section}>
        <div className="wrap">
          <div className="block-head">
            <div>
              <p className="eyebrow">{cfg.eyebrow}</p>
              <h2>{cfg.title}</h2>
              <p className="desc">{cfg.desc}</p>
            </div>
          </div>

          {items === null ? (
            <p className="desc">Loading the vault...</p>
          ) : (
            <>
              {topics.length > 0 && (
                <div className="filters">
                  {["All",
