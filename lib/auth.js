import crypto from "crypto";

const COOKIE_NAME = "sv_owner";
const SESSION_HOURS = 12;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set.");
  }
  return secret;
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

// Builds a signed token: "<expiryTimestamp>.<hmacSignature>"
export function createSessionToken() {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expiry);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = sign(payload);
  const sigBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  if (sigBuffer.length !== expectedBuffer.length) return false;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return false;
  const expiry = Number(payload);
  if (Number.isNaN(expiry) || Date.now() > expiry) return false;
  return true;
}

export const OWNER_COOKIE_NAME = COOKIE_NAME;
export const OWNER_COOKIE_MAX_AGE = SESSION_HOURS * 60 * 60;
