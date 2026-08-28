import { NextResponse } from "next/server";
import { SECTIONS, getItems } from "../../../lib/kv";

// Turns all of ScholarVault's saved content into a compact text block
// that gets handed to the AI as background knowledge.
async function buildContext() {
  const sections = await Promise.all(
    SECTIONS.map(async (section) => ({ section, items: await getItems(section) }))
  );

  let context = "";
  for (const { section, items } of sections) {
    if (items.length === 0) continue;
    context += `\n## ${section.toUpperCase()}\n`;
    for (const item of items) {
      context += `- [${item.topic}] ${item.title}: ${item.content}\n`;
    }
  }
  return context.trim();
}

export async function POST(request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI assistant isn't configured yet." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const question = (body?.question ?? "").trim();
  if (!question) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }
  if (question.length > 1000) {
    return NextResponse.json({ error: "Question is too long." }, { status: 400 });
  }

  let context;
  try {
    context = await buildContext();
  } catch (err) {
    console.error("Failed to build context:", err);
    context = "";
  }

  const systemPrompt = `You are a helpful study assistant for World Scholar's Cup (WSC) students on a site called ScholarVault.

   Answer the student's question using your general knowledge of WSC and, where relevant, the site's own content below. If the site's content directly answers the question, prioritize and reference it.

Keep answers SHORT — 2-4 sentences maximum, unless the student explicitly asks for more detail or a full list. Get straight to the point, no long preambles or over-explaining.

SCHOLARVAULT CONTENT:
${context || "(No content saved yet.)"}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
                  model: "openai/gpt-oss-120b",
           messages: [
             { role: "system", content: systemPrompt },
             { role: "user", content: question },
           ],
           max_tokens: 200,
         }),
    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { error: "The AI assistant is having trouble right now. Try again shortly." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      "Sorry, I couldn't come up with an answer for that.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Ask route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Try again shortly." },
      { status: 500 }
    );
  }
}
