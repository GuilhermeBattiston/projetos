import { createHash, randomBytes } from "node:crypto";
import { hash, verify, Algorithm } from "@node-rs/argon2";
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export const normalizeUsername = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";
export const validUsername = (value) =>
  /^[a-z0-9][a-z0-9._-]{2,63}$/.test(value);
export const validSlug = (value) =>
  typeof value === "string" &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
  value.length <= 80;
export async function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < 14 ||
    !password.trim() ||
    Buffer.byteLength(password) > 1024
  )
    throw new Error(
      "A senha precisa ter pelo menos 14 caracteres e no máximo 1024 bytes.",
    );
  return hash(password, {
    algorithm: Algorithm.Argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    outputLen: 32,
  });
}
export async function verifyPassword(stored, password) {
  try {
    return await verify(stored, password);
  } catch {
    return false;
  }
}
export function consumeLimit(db, key, now, windowMs, max) {
  const row = db
    .prepare(
      `INSERT INTO login_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count,expires_at`,
    )
    .get(key, now + windowMs, now, now);
  return {
    allowed: row.count <= max,
    retry: Math.max(1, Math.ceil((row.expires_at - now) / 1000)),
  };
}
