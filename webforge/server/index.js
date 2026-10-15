import { loadConfig } from "./config.js";
import { openDatabase } from "./database.js";
import { createApp } from "./app.js";
process.umask(0o077);
try {
  const config = loadConfig();
  const db = openDatabase(config.dbPath);
  const app = await createApp({ config, db });
  const server = app.listen(config.port, "0.0.0.0", () =>
    console.log(
      `WebForge iniciado na porta ${config.port}. Nenhuma conta é criada automaticamente.`,
    ),
  );
  const stop = () => {
    server.close(() => {
      db.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
