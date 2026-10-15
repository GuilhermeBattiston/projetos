import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { loadConfig } from "../server/config.js";
import { openDatabase } from "../server/database.js";
import { createApp } from "../server/app.js";
import { createCompany, createUser } from "../server/accounts.js";
const config = loadConfig();
const db = openDatabase(":memory:");
const password = "Disposable-test-" + randomBytes(24).toString("hex");
createCompany(db, {
  name: "Test client A",
  slug: "tapioca-estacao-br",
  prototype: "tapioca-estacao-br",
});
createCompany(db, {
  name: "Test client B",
  slug: "lima-climatizacao",
  prototype: "lima-climatizacao",
});
await createUser(db, {
  companySlug: "tapioca-estacao-br",
  username: "browser-client-a",
  password,
});
await createUser(db, {
  companySlug: "lima-climatizacao",
  username: "browser-client-b",
  password,
});
const app = await createApp({ config, db });
const server = app.listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
config.origin = `http://127.0.0.1:${server.address().port}`;
try {
  const result = await new Promise((resolve, reject) => {
    const child = spawn("python", ["tests/browser-smoke.py"], {
      cwd: new URL("..", import.meta.url),
      stdio: "inherit",
      env: {
        ...process.env,
        WEBFORGE_TEST_ORIGIN: config.origin,
        WEBFORGE_TEST_PASSWORD: password,
      },
    });
    child.on("error", reject);
    child.on("exit", resolve);
  });
  process.exitCode = result || 0;
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  db.close();
}
