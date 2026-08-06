import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, OWNER_COOKIE_NAME } from "../../../lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_COOKIE_NAME)?.value;
  return NextResponse.json({ isOwner: isValidSessionToken(token) });
}
