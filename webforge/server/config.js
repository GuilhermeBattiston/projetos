import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export const prototypeRegistry = JSON.parse(
  readFileSync(path.join(root, "prototypes.json"), "utf8"),
);
export const prototypes = Object.freeze(
  prototypeRegistry.map((entry) => entry.slug),
);
export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const port = Number(env.PORT || 8080);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error("PORT inválida.");
  if (production && !env.APP_ORIGIN)
    throw new Error("APP_ORIGIN é obrigatório em produção.");
  const originUrl = new URL(env.APP_ORIGIN || `http://127.0.0.1:${port}`);
  if (
    !["http:", "https:"].includes(originUrl.protocol) ||
    originUrl.username ||
    originUrl.password ||
    originUrl.search ||
    originUrl.hash ||
    originUrl.pathname !== "/"
  )
    throw new Error("APP_ORIGIN deve conter apenas protocolo e domínio.");
  if (production && originUrl.protocol !== "https:")
    throw new Error("APP_ORIGIN precisa usar HTTPS em produção.");
  const trustProxy = Number(env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(trustProxy) || trustProxy < 0 || trustProxy > 3)
    throw new Error("TRUST_PROXY_HOPS inválido.");
  const ttl = Number(env.SESSION_TTL_SECONDS || 3600);
  if (!Number.isInteger(ttl) || ttl < 60 || ttl > 28800)
    throw new Error("SESSION_TTL_SECONDS deve estar entre 60 e 28800.");
  const dataDir = path.resolve(env.DATA_DIR || path.join(root, "data"));
  return {
    production,
    port,
    origin: originUrl.origin,
    trustProxy,
    sessionTtl: ttl * 1000,
    dataDir,
    dbPath: path.join(dataDir, "webforge.sqlite"),
    prototypeRoot: path.resolve(
      env.PROTOTYPE_ROOT || path.join(root, "private/prototypes"),
    ),
    publicRoot: path.join(root, "public"),
    loginWindow: 15 * 60 * 1000,
    loginUserMax: 8,
    loginIpMax: 25,
    verificationConcurrency: 2,
  };
}
