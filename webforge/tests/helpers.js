import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { loadConfig } from "../server/config.js";
import { openDatabase } from "../server/database.js";
import { createApp } from "../server/app.js";
import { createCompany, createUser } from "../server/accounts.js";
export async function fixture(overrides = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), "webforge-test-"));
  const root = path.join(directory, "prototypes");
  for (const slug of ["tapioca-estacao-br", "lima-climatizacao"]) {
    await mkdir(path.join(root, slug, "assets"), { recursive: true });
    await writeFile(
      path.join(root, slug, "index.html"),
      `<!doctype html><html><head><title>${slug}</title></head><body>PRIVATE-${slug}</body></html>`,
    );
    await writeFile(
      path.join(root, slug, "assets/test.js"),
      `// PRIVATE-${slug}`,
    );
  }
  const db = openDatabase(":memory:");
  const password = "Test-only-" + randomBytes(24).toString("hex");
  createCompany(db, {
    name: "Test A",
    slug: "tapioca-estacao-br",
    prototype: "tapioca-estacao-br",
  });
  createCompany(db, {
    name: "Test B",
    slug: "lima-climatizacao",
    prototype: "lima-climatizacao",
  });
  await createUser(db, {
    companySlug: "tapioca-estacao-br",
    username: "test-a",
    password,
  });
  await createUser(db, {
    companySlug: "lima-climatizacao",
    username: "test-b",
    password,
  });
  let now = Date.now();
  const config = {
    ...loadConfig({}),
    prototypeRoot: root,
    loginIpMax: 200,
    loginUserMax: 100,
    ...overrides,
  };
  const app = await createApp({ config, db, clock: () => now });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  config.origin = origin;
  const request = (route, options = {}) =>
    fetch(origin + route, { redirect: "manual", ...options });
  const login = (username = "test-a", pass = password, extra = {}) =>
    request("/projetos/api/login", {
      method: "POST",
      headers: {
        Origin: config.origin,
        "Content-Type": "application/json",
        ...extra.headers,
      },
      body: JSON.stringify({ username, password: pass, ...extra.body }),
    });
  return {
    directory,
    root,
    db,
    password,
    config,
    server,
    origin,
    request,
    login,
    now: () => now,
    tick: (ms) => {
      now += ms;
    },
    close: async () => {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      db.close();
      await rm(directory, { recursive: true, force: true });
    },
  };
}
export const cookie = (response) =>
  response.headers.get("set-cookie").split(";")[0];
