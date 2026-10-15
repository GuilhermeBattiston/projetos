import test from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "../server/config.js";
import { createCompany, createUser } from "../server/accounts.js";
import { openDatabase } from "../server/database.js";
test("production fails closed without a valid HTTPS origin", () => {
  assert.throws(() => loadConfig({ NODE_ENV: "production" }), /APP_ORIGIN/);
  for (const origin of [
    "http://example.com",
    "https://example.com/path",
    "https://user:password@example.com",
    "https://example.com?x=1",
  ])
    assert.throws(() =>
      loadConfig({ NODE_ENV: "production", APP_ORIGIN: origin }),
    );
  assert.equal(
    loadConfig({
      NODE_ENV: "production",
      APP_ORIGIN: "https://portal.example.com",
    }).origin,
    "https://portal.example.com",
  );
});
test("accounts are not automatically provisioned; only registered slugs are accepted", async () => {
  const db = openDatabase(":memory:");
  try {
    assert.equal(db.prepare("SELECT count(*) AS n FROM users").get().n, 0);
    assert.equal(db.prepare("SELECT count(*) AS n FROM companies").get().n, 0);
    assert.throws(() =>
      createCompany(db, {
        name: "Test",
        slug: "../../etc",
        prototype: "../../etc",
      }),
    );
    assert.throws(() =>
      createCompany(db, {
        name: "Test",
        slug: "different",
        prototype: "tapioca-estacao-br",
      }),
    );
    createCompany(db, {
      name: "Test",
      slug: "tapioca-estacao-br",
      prototype: "tapioca-estacao-br",
    });
    await assert.rejects(
      () =>
        createUser(db, {
          companySlug: "tapioca-estacao-br",
          username: "test",
          password: "short",
        }),
      /14/,
    );
    await assert.rejects(() => createUser(db, {companySlug: "tapioca-estacao-br", username: "test", password: "                "}), /14/);
    await assert.rejects(
      () =>
        createUser(db, {
          companySlug: "tapioca-estacao-br",
          username: "' OR 1=1",
          password: "only-disposable-test-password",
        }),
      /Usuário/,
    );
  } finally {
    db.close();
  }
});
