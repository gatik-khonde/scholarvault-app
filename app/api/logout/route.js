import { NextResponse } from "next/server";
import { OWNER_COOKIE_NAME } from "../../../lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(OWNER_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
