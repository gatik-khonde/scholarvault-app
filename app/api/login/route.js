import { NextResponse } from "next/server";
import crypto from "crypto";
import { createSessionToken, OWNER_COOKIE_NAME, OWNER_COOKIE_MAX_AGE } from "../../../lib/auth";

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerPassword) {
    return NextResponse.json(
      { error: "Server is not configured with OWNER_PASSWORD." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const password = body?.password ?? "";
  if (!safeEqual(password, ownerPassword)) {
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(OWNER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: OWNER_COOKIE_MAX_AGE,
  });
  return response;
}
