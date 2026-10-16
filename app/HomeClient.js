"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import AskWidget from "./AskWidget";

const SECTIONS = {
  notes: { label: "note", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/d/...", contentLabel: "Content (or leave blank if linking a Google Doc)", eyebrow: "Field Notes", title: "Published Notes", desc: "Topic write-ups and summaries — write inline or link a Google Doc for longer material.", empty: "No notes published yet. Add your first set of notes to get started." },
  quizzes: { label: "quiz", hasLink: true, linkLabel: "Google Form", linkPlaceholder: "https://docs.google.com/forms/...", contentLabel: "Description (what it covers, format, etc.)", eyebrow: "Scholar's Challenge", title: "Topic Quizzes", desc: "Short self-check quizzes on a single topic, including linked Google Forms.", empty: "No quizzes yet. Add a topic quiz or link a Google Form." },
   prompts: { label: "prompt", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/...", contentLabel: "Prompt text", eyebrow: "Collaborative Writing", title: "Writing Prompts", desc: "Prompts to practice framing, structure, and voice under time pressure.", empty: "No writing prompts yet. Add one to start building the set." },
   motions: { label: "motion", hasLink: true, linkLabel: "Google Doc", linkPlaceholder: "https://docs.google.com/document/...", contentLabel: "Notes (case for / against, sources, etc.)", eyebrow: "Team Debate", title: "Debate Motions", desc: "Motions worth drilling — for and against, with room for your own case notes.", empty: "No motions yet. Add a motion worth drilling." },
   mcq: { label: "MCQ set", hasLink: true, linkLabel: "Link", linkPlaceholder: "Paste a Google Doc or PDF link", contentLabel: "Description (topics covered, notes)", eyebrow: "Scholar's Bowl · 120 Questions", title: "MCQ Archives", desc: "Full-length 120-question sets — link a Google Doc or PDF.", empty: "No MCQ sets yet. Link your first 120-question set." },

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

export default function HomeClient({ initialData }) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [data, setData] = useState(initialData || {});
  const [filters, setFilters] = useState({});
  const [toastMsg, setToastMsg] = useState("");

  const [passOpen, setPassOpen] = useState(false);
  const [passValue, setPassValue] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formSection, setFormSection] = useState(null);
  const [formFields, setFormFields] = useState({ title: "", topic: "", content: "", link: "" });

  const [viewItem, setViewItem] = useState(null);
  const [viewSection, setViewSection] = useState(null);

  // Saved-to-vault state (keys look like "notes:<id>")
  const [savedIds, setSavedIds] = useState([]);
  const [savingKey, setSavingKey] = useState("");

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 4500);
  }, []);

  const loadSection = useCallback(async (section) => {
    const res = await fetch(`/api/data/${section}`);
    const json = await res.json();
    setData((prev) => ({ ...prev, [section]: json.items || [] }));
  }, []);

  useEffect(() => {
    SECTION_KEYS.forEach((s) => {
      setFilters((prev) => ({ ...prev, [s]: "All" }));
    });
    fetch("/api/session")
      .then((r) => r.json())
      .then((j) => setIsOwner(!!j.isOwner))
      .catch(() => {});

    // Load which items this visitor has already saved (only if logged in)
    supabase.auth.getSession().then(({ data: s }) => {
      if (!s || !s.session) return;
      supabase
        .from("saved_notes")
        .select("note_id")
        .then(({ data: rows }) => {
          if (rows) setSavedIds(rows.map((r) => r.note_id));
        });
    });
  }, []);

  async function toggleSave(e, section, item) {
    e.stopPropagation(); // don't open the item's popup
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
        doc_url: item.link || `/#${section}`,
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

  function saveButton(section, item) {
    const noteKey = `${section}:${item.id}`;
    const isSaved = savedIds.includes(noteKey);
    return (
      <button
        type="button"
        onClick={(e) => toggleSave(e, section, item)}
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

  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    setIsOwner(false);
    showToast("S
