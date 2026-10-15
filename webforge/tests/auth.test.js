import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { rm, symlink } from "node:fs/promises";
import path from "node:path";
import { fixture, cookie } from "./helpers.js";
import { createApp } from "../server/app.js";
import {
  resetPassword,
  revokeSessions,
  setUserStatus,
  setCompanyStatus,
} from "../server/accounts.js";
import { digest, hashPassword } from "../server/security.js";
const rawRequest = (origin, route, headers = {}) =>
  new Promise((resolve, reject) => {
    const url = new URL(origin);
    const req = http.request(
      { host: url.hostname, port: url.port, path: route, headers },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on("error", reject);
    req.end();
  });
test("authentication and per-company access control on real HTTP requests", async (t) => {
  const f = await fixture();
  t.after(f.close);
  let tokenCookie;
  await t.test(
    "public page contains no client brands, credentials, or company list",
    async () => {
      const r = await f.request("/projetos");
      const html = await r.text();
      assert.equal(r.status, 200);
      assert.match(html, /Acesse seu projeto/);
      assert.doesNotMatch(html, /Tapioca|Lima Climatização|test-a|test-b/);
      assert.equal(r.headers.get("cache-control"), "no-store, max-age=0");
      assert.match(
        r.headers.get("content-security-policy"),
        /script-src 'self'/,
      );
    },
  );
  await t.test(
    "wrong password and nonexistent user return the same response",
    async () => {
      const a = await f.login("test-a", "incorrect");
      const b = await f.login("nobody", "incorrect");
      assert.equal(a.status, 401);
      assert.equal(b.status, 401);
      assert.deepEqual(await a.json(), await b.json());
      assert.equal(a.headers.get("set-cookie"), null);
    },
  );
  await t.test(
    "correct password creates a rotated opaque HttpOnly session and ignores next redirects",
    async () => {
      const r = await f.login("test-a", f.password, {
        body: { next: "https://attacker.example", companyId: "other" },
      });
      assert.equal(r.status, 200);
      assert.deepEqual(await r.json(), {
        redirect: "/projetos/tapioca-estacao-br/",
      });
      tokenCookie = cookie(r);
      assert.match(r.headers.get("set-cookie"), /HttpOnly/);
      assert.match(r.headers.get("set-cookie"), /SameSite=Lax/);
      const token = tokenCookie.split("=")[1];
      const row = f.db.prepare("SELECT token_hash FROM sessions").get();
      assert.equal(row.token_hash, digest(token));
      assert.notEqual(row.token_hash, token);
      assert.match(
        f.db
          .prepare("SELECT password_hash FROM users WHERE username=?")
          .get("test-a").password_hash,
        /^\$argon2id\$/,
      );
    },
  );
  await t.test(
    "direct unauthenticated page and protected scripts are denied",
    async () => {
      for (const route of [
        "/projetos/tapioca-estacao-br/",
        "/projetos/tapioca-estacao-br/assets/test.js",
      ]) {
        const r = await f.request(route);
        assert.equal(r.status, 401);
        assert.doesNotMatch(await r.text(), /PRIVATE-/);
      }
      const navigation = await f.request("/projetos/tapioca-estacao-br/", {
        headers: { Accept: "text/html" },
      });
      assert.equal(navigation.status, 303);
      assert.equal(navigation.headers.get("location"), "/projetos");
    },
  );
  await t.test(
    "authorized index, refresh, assets and canonical trailing slash work",
    async () => {
      for (const route of [
        "/projetos/tapioca-estacao-br/",
        "/projetos/tapioca-estacao-br/assets/test.js",
      ]) {
        const r = await f.request(route, { headers: { Cookie: tokenCookie } });
        assert.equal(r.status, 200);
        assert.match(await r.text(), /PRIVATE-tapioca-estacao-br/);
        assert.match(r.headers.get("cache-control"), /no-store/);
      }
      const index = await f.request("/projetos/tapioca-estacao-br/", {
        headers: { Cookie: tokenCookie },
      });
      assert.match(await index.text(), /\/projetos\/portal\/session.js/);
      assert.equal(
        (
          await f.request("/projetos/tapioca-estacao-br", {
            headers: { Cookie: tokenCookie },
          })
        ).status,
        308,
      );
    },
  );
  await t.test(
    "cross-company pages AND static files return 403 without private content",
    async () => {
      for (const route of [
        "/projetos/lima-climatizacao/",
        "/projetos/lima-climatizacao/assets/test.js",
        "/projetos/unknown-company/",
      ]) {
        const r = await f.request(route, { headers: { Cookie: tokenCookie } });
        assert.equal(r.status, 403);
        assert.doesNotMatch(await r.text(), /PRIVATE-/);
      }
    },
  );
  await t.test(
    "CSRF and untrusted origins cannot log in or log out",
    async () => {
      assert.equal(
        (
          await f.login("test-a", f.password, {
            headers: { Origin: "https://attacker.example" },
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await f.request("/projetos/api/logout", {
            method: "POST",
            headers: {
              Cookie: tokenCookie,
              Origin: "https://attacker.example",
            },
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await f.request("/projetos/api/logout", {
            method: "POST",
            headers: { Cookie: tokenCookie },
          })
        ).status,
        403,
      );
      assert.equal(
        (
          await f.request("/projetos/api/session", {
            headers: { Cookie: tokenCookie },
          })
        ).status,
        200,
      );
    },
  );
  await t.test(
    "path traversal, double encoding and symlinks cannot expose files",
    async () => {
      await symlink(
        path.join(f.root, "lima-climatizacao/assets/test.js"),
        path.join(f.root, "tapioca-estacao-br/assets/escape.js"),
      );
      assert.equal(
        (
          await f.request("/projetos/tapioca-estacao-br/assets/escape.js", {
            headers: { Cookie: tokenCookie },
          })
        ).status,
        404,
      );
      for (const route of [
        "/projetos/tapioca-estacao-br/%2e%2e/lima-climatizacao/assets/test.js",
        "/projetos/tapioca-estacao-br/%252e%252e/x",
        "/projetos/tapioca-estacao-br/%2fprivate",
        "/projetos/tapioca-estacao-br/.env",
      ]) {
        const r = await rawRequest(f.origin, route, { Cookie: tokenCookie });
        assert.equal(r.status, 400);
        assert.doesNotMatch(r.body, /PRIVATE-/);
      }
      for (const route of [
        "/private/prototypes/tapioca-estacao-br/index.html",
        "/server/app.js",
        "/projetos/portal/private/tapioca-estacao-br/index.html",
      ]) {
        const r = await f.request(route);
        assert.notEqual(r.status, 200);
        assert.doesNotMatch(await r.text(), /PRIVATE-/);
      }
    },
  );
  await t.test(
    "logout revokes session and old token cannot be reused",
    async () => {
      assert.equal(
        (
          await f.request("/projetos/api/logout", {
            method: "POST",
            headers: { Origin: f.config.origin, Cookie: tokenCookie },
          })
        ).status,
        204,
      );
      assert.equal(
        (
          await f.request("/projetos/tapioca-estacao-br/", {
            headers: { Cookie: tokenCookie },
          })
        ).status,
        401,
      );
      assert.equal(
        f.db.prepare("SELECT count(*) AS n FROM sessions").get().n,
        0,
      );
    },
  );
  await t.test(
    "absolute session expiration is enforced by server",
    async () => {
      const r = await f.login();
      const expiredCookie = cookie(r);
      f.tick(f.config.sessionTtl + 1);
      assert.equal(
        (
          await f.request("/projetos/api/session", {
            headers: { Cookie: expiredCookie },
          })
        ).status,
        401,
      );
      assert.equal(
        (
          await f.request("/projetos/tapioca-estacao-br/assets/test.js", {
            headers: { Cookie: expiredCookie },
          })
        ).status,
        401,
      );
    },
  );
  await t.test("session rotation removes previous session token", async () => {
    const a = await f.login();
    const old = cookie(a);
    const b = await f.login("test-a", f.password, { headers: { Cookie: old } });
    assert.equal(b.status, 200);
    assert.notEqual(cookie(b), old);
    assert.equal(
      (await f.request("/projetos/api/session", { headers: { Cookie: old } }))
        .status,
      401,
    );
  });
  await t.test(
    "password reset and administrative revocation revoke all sessions",
    async () => {
      const r = await f.login();
      const old = cookie(r);
      await resetPassword(f.db, "test-a", f.password);
      assert.equal(
        (await f.request("/projetos/api/session", { headers: { Cookie: old } }))
          .status,
        401,
      );
      const s = await f.login();
      revokeSessions(f.db, "test-a");
      assert.equal(
        (
          await f.request("/projetos/api/session", {
            headers: { Cookie: cookie(s) },
          })
        ).status,
        401,
      );
    },
  );
  await t.test(
    "disabled user and company cannot log in or reuse sessions",
    async () => {
      const r = await f.login();
      const old = cookie(r);
      setUserStatus(f.db, "test-a", "disabled");
      assert.equal((await f.login()).status, 401);
      assert.equal(
        (await f.request("/projetos/api/session", { headers: { Cookie: old } }))
          .status,
        401,
      );
      setUserStatus(f.db, "test-a", "active");
      const s = await f.login();
      setCompanyStatus(f.db, "tapioca-estacao-br", "disabled");
      assert.equal((await f.login()).status, 401);
      assert.equal(
        (
          await f.request("/projetos/api/session", {
            headers: { Cookie: cookie(s) },
          })
        ).status,
        401,
      );
      setCompanyStatus(f.db, "tapioca-estacao-br", "active");
    },
  );
  await t.test(
    "unavailable build shows a generic 503 and does not create a session",
    async () => {
      await rm(path.join(f.root, "lima-climatizacao"), { recursive: true });
      const r = await f.login("test-b");
      assert.equal(r.status, 503);
      assert.match((await r.json()).message, /indisponível/);
      assert.equal(r.headers.get("set-cookie"), null);
    },
  );
});
test("persistent rate limiting works across multiple app instances", async (t) => {
  const f = await fixture({ loginUserMax: 3, loginIpMax: 50 });
  t.after(f.close);
  for (let i = 0; i < 3; i++)
    assert.equal((await f.login("test-a", "incorrect")).status, 401);
  const r = await f.login();
  assert.equal(r.status, 429);
  assert.ok(Number(r.headers.get("retry-after")) > 0);
  assert.equal(
    f.db
      .prepare("SELECT count FROM login_limits WHERE key=?")
      .get("user:" + digest("test-a")).count,
    4,
  );
  const config2 = { ...f.config };
  const app2 = await createApp({ config: config2, db: f.db, clock: f.now });
  const server2 = app2.listen(0, "127.0.0.1");
  await new Promise((resolve) => server2.once("listening", resolve));
  config2.origin = `http://127.0.0.1:${server2.address().port}`;
  try {
    const persisted = await fetch(config2.origin + "/projetos/api/login", {
      method: "POST",
      headers: { Origin: config2.origin, "Content-Type": "application/json" },
      body: JSON.stringify({ username: "test-a", password: f.password }),
    });
    assert.equal(persisted.status, 429);
  } finally {
    server2.closeAllConnections();
    await new Promise((resolve) => server2.close(resolve));
  }
  f.tick(f.config.loginWindow + 1);
  assert.equal((await f.login()).status, 200);
});
test("production cookies require TLS and use Secure / __Host- semantics", async (t) => {
  const f = await fixture({ production: true, trustProxy: 1 });
  t.after(f.close);
  assert.equal((await f.request("/projetos")).status, 426);
  const r = await f.login("test-a", f.password, {
    headers: { "X-Forwarded-Proto": "https" },
  });
  assert.equal(r.status, 200);
  const header = r.headers.get("set-cookie");
  assert.match(header, /^__Host-webforge=/);
  assert.match(header, /; Secure/);
  assert.match(header, /; HttpOnly/);
  assert.match(header, /; Path=\//);
  assert.doesNotMatch(header, /Domain=/);
  assert.match(r.headers.get("strict-transport-security"), /max-age=31536000/);
});

test("password verification concurrency is bounded to protect server resources", async (t) => {
  const f = await fixture({ verificationConcurrency: 1 });
  t.after(f.close);
  const responses = await Promise.all(
    Array.from({ length: 8 }, () => f.login("test-a", "incorrect")),
  );
  assert.ok(responses.some((r) => r.status === 429));
  assert.ok(responses.some((r) => r.status === 401));
  assert.ok(responses.every((r) => [401, 429].includes(r.status)));
});

test("password reset during verification cannot create a fresh session with the old password", async (t) => {
  const f = await fixture();
  t.after(f.close);
  const replacement = await hashPassword(
    "Disposable replacement password for test",
  );
  const pending = f.login();
  await new Promise((resolve) => setTimeout(resolve, 25));
  f.db
    .prepare("UPDATE users SET password_hash=? WHERE username=?")
    .run(replacement, "test-a");
  const response = await pending;
  assert.equal(response.status, 401);
  assert.equal(f.db.prepare("SELECT count(*) AS n FROM sessions").get().n, 0);
});

test('blocked IPs cannot grow arbitrary per-user rate-limit rows', async t => {
  const f = await fixture({ loginIpMax: 2, loginUserMax: 100 });
  t.after(f.close);
  assert.equal((await f.login('unknown-one','incorrect')).status,401);
  assert.equal((await f.login('unknown-two','incorrect')).status,401);
  const count = f.db.prepare('SELECT count(*) AS n FROM login_limits').get().n;
  for (let i=0;i<8;i++) assert.equal((await f.login('unknown-'+i,'incorrect')).status,429);
  assert.equal(f.db.prepare('SELECT count(*) AS n FROM login_limits').get().n,count);
});
