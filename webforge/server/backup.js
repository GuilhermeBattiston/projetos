import { mkdirSync, chmodSync } from "node:fs";
import path from "node:path";
import { loadConfig } from "./config.js";
import { openDatabase } from "./database.js";
process.umask(0o077);
const config = loadConfig();
const db = openDatabase(config.dbPath);
try {
  const directory = path.join(config.dataDir, "backups");
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const filename = path.join(directory, `webforge-${Date.now()}.sqlite`);
  db.prepare("VACUUM INTO ?").run(filename);
  chmodSync(filename, 0o600);
  console.log(
    "Backup consistente criado na pasta data/backups. Proteja-o como dado confidencial.",
  );
} finally {
  db.close();
}
