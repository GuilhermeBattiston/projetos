import { randomUUID } from "node:crypto";
import { prototypes } from "./config.js";
import {
  validSlug,
  validUsername,
  normalizeUsername,
  hashPassword,
} from "./security.js";
const transaction = (db, operation) => {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = operation();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
};
export function createCompany(db, { name, slug, prototype }) {
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    !validSlug(slug) ||
    slug !== prototype ||
    !prototypes.includes(prototype)
  )
    throw new Error(
      "Empresa inválida. O slug deve corresponder a um protótipo registrado.",
    );
  const id = randomUUID();
  db.prepare(
    "INSERT INTO companies(id,name,slug,prototype) VALUES(?,?,?,?)",
  ).run(id, name.trim(), slug, prototype);
  return id;
}
export async function createUser(db, { companySlug, username, password }) {
  username = normalizeUsername(username);
  if (!validUsername(username))
    throw new Error(
      "Usuário precisa ter 3–64 caracteres: letras minúsculas, números, ponto, hífen ou sublinhado.",
    );
  const company = db
    .prepare("SELECT id FROM companies WHERE slug=? AND status='active'")
    .get(companySlug);
  if (!company) throw new Error("Empresa não encontrada ou desativada.");
  const passwordHash = await hashPassword(password);
  const id = randomUUID();
  db.prepare(
    "INSERT INTO users(id,company_id,username,password_hash) VALUES(?,?,?,?)",
  ).run(id, company.id, username, passwordHash);
  return id;
}
export function revokeSessions(db, username) {
  const user = db
    .prepare("SELECT id FROM users WHERE username=?")
    .get(normalizeUsername(username));
  if (!user) throw new Error("Usuário não encontrado.");
  return db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id)
    .changes;
}
export async function resetPassword(db, username, password) {
  const passwordHash = await hashPassword(password);
  transaction(db, () => {
    const user = db
      .prepare("SELECT id FROM users WHERE username=?")
      .get(normalizeUsername(username));
    if (!user) throw new Error("Usuário não encontrado.");
    db.prepare("UPDATE users SET password_hash=? WHERE id=?").run(
      passwordHash,
      user.id,
    );
    db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
  });
}
export function setUserStatus(db, username, status) {
  if (!["active", "disabled"].includes(status))
    throw new Error("Status inválido.");
  transaction(db, () => {
    const user = db
      .prepare("SELECT id FROM users WHERE username=?")
      .get(normalizeUsername(username));
    if (!user) throw new Error("Usuário não encontrado.");
    db.prepare("UPDATE users SET status=? WHERE id=?").run(status, user.id);
    db.prepare("DELETE FROM sessions WHERE user_id=?").run(user.id);
  });
}
export function setCompanyStatus(db, slug, status) {
  if (!["active", "disabled"].includes(status))
    throw new Error("Status inválido.");
  transaction(db, () => {
    const company = db
      .prepare("SELECT id FROM companies WHERE slug=?")
      .get(slug);
    if (!company) throw new Error("Empresa não encontrada.");
    db.prepare("UPDATE companies SET status=? WHERE id=?").run(
      status,
      company.id,
    );
    db.prepare(
      "DELETE FROM sessions WHERE user_id IN(SELECT id FROM users WHERE company_id=?)",
    ).run(company.id);
  });
}
