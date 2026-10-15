import { spawnSync } from "node:child_process";
import { cp, mkdir, rm, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { root, prototypeRegistry } from "../server/config.js";
import { validSlug } from "../server/security.js";
const repo = await realpath(path.join(root, ".."));
const destination = path.join(root, "private/prototypes");
await mkdir(destination, { recursive: true });
for (const entry of prototypeRegistry) {
  if (!validSlug(entry.slug) || !validSlug(entry.source))
    throw new Error("Registro de protótipo inválido.");
  const source = await realpath(path.join(repo, entry.source));
  if (!source.startsWith(repo + path.sep))
    throw new Error("Fonte fora do repositório.");
  const result = spawnSync("npm", ["run", "build"], {
    cwd: source,
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "false",
      WEBFORGE_BASE: `/projetos/${entry.slug}/`,
    },
  });
  if (result.status !== 0) process.exit(result.status || 1);
  const target = path.join(destination, entry.slug);
  await rm(target, { recursive: true, force: true });
  await cp(path.join(source, "dist"), target, { recursive: true });
  const html = await readFile(path.join(target, "index.html"), "utf8");
  if (!html.includes(`/projetos/${entry.slug}/assets/`))
    throw new Error("Base de build incorreta.");
  console.log(`Protótipo preparado em armazenamento privado: ${entry.slug}`);
}
console.log(
  "Build privado concluído. Não publique a pasta private em hospedagem estática.",
);
