import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, OWNER_COOKIE_NAME } from "../../../../../lib/auth";
import { isValidSection, getItems, saveItems } from "../../../../../lib/kv";

export async function DELETE(request, { params }) {
  const { section, id } = await params;
  if (!isValidSection(section)) {
    return NextResponse.json({ error: "Unknown section." }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(OWNER_COOKIE_NAME)?.value;
  if (!isValidSessionToken(token)) {
    return NextResponse.json({ error: "Not signed in as owner." }, { status: 401 });
  }

  try {
    const items = await getItems(section);
    const filtered = items.filter((item) => String(item.id) !== String(id));
    await saveItems(section, filtered);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/data error:", err);
    return NextResponse.json({ error: "Could not remove right now." }, { status: 500 });
  }
}
