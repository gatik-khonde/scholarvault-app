import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GROQ_API_KEY;
  return NextResponse.json({
    keyIsSet: !!key,
    keyLength: key ? key.length : 0,
  });
}
