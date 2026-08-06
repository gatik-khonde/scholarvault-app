import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { isValidSessionToken, OWNER_COOKIE_NAME } from "../../../../lib/auth";
import { isValidSection, getItems, saveItems } from "../../../../lib/kv";

export async function GET(request, { params }) {
  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }
  try {
    const items = await getItems(section);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("GET /api/data error:", err);
    return NextResponse.json({ error: "Could not load data right now." }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { section } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not signed in as owner." }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const title = (body?.title ?? "").trim();
  const topic = (body?.topic ?? "").trim();
  const content = (body?.content ?? "").trim();
  const link = (body?.link ?? "").trim();

  if (!title || !topic) {
    return NextResponse.json({ error: "Title and topic are required." }, { status: 400 });
  }

  const newItem = {
    id: crypto.randomUUID(),
    title,
    topic,
    content,
    link: link || undefined,
    createdAt: Date.now(),
  };

  try {
    const items = await getItems(section);
    items.push(newItem);
    await saveItems(section, items);
    return NextResponse.json({ item: newItem });
  } catch (err) {
    console.error("POST /api/data error:", err);
    return NextResponse.json({ error: "Could not save right now." }, { status: 500 });
  }
}
