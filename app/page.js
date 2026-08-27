import { getItems, SECTIONS as SECTION_KEYS } from "../lib/kv";
import HomeClient from "./HomeClient";

// Always fetch fresh content on each request (owner adds items often).
export const dynamic = "force-dynamic";

export default async function Page() {
  const entries = await Promise.all(
    SECTION_KEYS.map(async (key) => [key, await getItems(key)])
  );
  const initialData = Object.fromEntries(entries);

  return <HomeClient initialData={initialData} />;
}
