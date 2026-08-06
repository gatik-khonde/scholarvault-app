import { Redis } from "@upstash/redis";

export const SECTIONS = ["notes", "quizzes", "prompts", "motions", "mcq"];

// Vercel's Redis (Upstash) marketplace integration sets either of these
// depending on how the store was connected.
const url =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let redis = null;
function getClient() {
  if (!url || !token) {
    throw new Error(
      "Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or connect a Redis store in Vercel)."
    );
  }
  if (!redis) {
    redis = new Redis({ url, token });
  }
  return redis;
}

export function isValidSection(section) {
  return SECTIONS.includes(section);
}

export async function getItems(section) {
  const items = await getClient().get(`section:${section}`);
  return Array.isArray(items) ? items : [];
}

export async function saveItems(section, items) {
  await getClient().set(`section:${section}`, items);
}
