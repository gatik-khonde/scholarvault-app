"use client";

import { useState, useRef, useEffect } from "react";

export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      const answer = res.ok ? data.answer : data.error || "Something went wrong.";
      setMessages((prev) => [...prev, { role: "ai", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Couldn't reach the assistant. Try again shortly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: "var(--dark-blue, #1c2b4a)",
          color: "white",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        }}
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            zIndex: 1000,
            width: 320,
            maxWidth: "calc(100vw - 48px)",
            height: 420,
            maxHeight: "calc(100vh - 140px)",
            background: "white",
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "inherit",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "var(--dark-blue, #1c2b4a)",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Ask about WSC
          </div>

          <div
            ref={scrollRef}
            style={{ flex: 1, overflowY: "auto", padding: 12, fontSize: 13.5 }}
          >
            {messages.length === 0 && (
              <p style={{ color: "#888", fontSize: 13 }}>
                Ask anything about World Scholar's Cup — topics, motions, prep tips,
                or the content on this site.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 10,
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 10,
                    maxWidth: "85%",
                    background: m.role === "user" ? "#e6ebf5" : "#f2f2f2",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <p style={{ color: "#888", fontSize: 13 }}>Thinking…</p>}
          </div>

          <form
            onSubmit={handleSend}
            style={{ display: "flex", borderTop: "1px solid #eee" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              style={{
                flex: 1,
                border: "none",
                padding: "10px 12px",
                fontSize: 13.5,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                border: "none",
                background: "transparent",
                padding: "0 14px",
                cursor: "pointer",
                fontWeight: 600,
                color: "var(--dark-blue, #1c2b4a)",
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
