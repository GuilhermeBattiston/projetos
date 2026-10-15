import express from "express";
import helmet from "helmet";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import {
  digest,
  token,
  hashPassword,
  verifyPassword,
  normalizeUsername,
  validUsername,
  validSlug,
  consumeLimit,
} from "./security.js";
import { prototypes } from "./config.js";

const genericLogin = "Usuário ou senha inválidos. Verifique suas credenciais.";
const statusPage = (title, message) =>
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>WebForge — ${title}</title><link rel="stylesheet" href="/projetos/portal/styles.css"></head><body class="status-page"><main><a class="wordmark" href="/projetos">webforge<span>®</span></a><h1>${title}</h1><p>${message}</p><a class="status-link" href="/projetos">Voltar ao acesso</a></main><script src="/projetos/portal/session.js" defer></script></body></html>`;
const within = (parent, child) => child.startsWith(parent + path.sep);
export async function createApp({ config, db, clock = Date.now }) {
  const app = express();
  app.disable("x-powered-by");
  app.disable("etag");
  app.set("trust proxy", config.trustProxy);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameAncestors: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'none'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: config.production ? [] : null,
        },
      },
      strictTransportSecurity: config.production
        ? { maxAge: 31536000, includeSubDomains: false }
        : false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use((req, res, next) => {
    res.set({
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
      "Referrer-Policy": "no-referrer",
    });
    res.vary("Cookie");
    next();
  });
  app.get("/healthz", (_req, res) => res.json({ status: "ok" }));
  app.use((req, res, next) => {
    if (config.production && !req.secure)
      return res
        .status(426)
        .send(
          statusPage(
            "Conexão segura necessária",
            "Acesse este ambiente pelo endereço HTTPS configurado.",
          ),
        );
    next();
  });
  app.use((req, res, next) => {
    const raw = req.originalUrl.split("?")[0];
    try {
      const decoded = decodeURIComponent(raw);
      if (
        /%2f|%5c|%00|%25/i.test(raw) ||
        decoded.includes("\\") ||
        decoded
          .split("/")
          .some((p) => p === "." || p === ".." || p.startsWith("."))
      )
        return res
          .status(400)
          .send(
            statusPage(
              "Solicitação inválida",
              "Este endereço não está disponível.",
            ),
          );
    } catch {
      return res.status(400).end();
    }
    next();
  });
  app.use(express.json({ limit: "4kb", strict: true }));
  const cookieName = config.production ? "__Host-webforge" : "webforge_session";
  const cookieOptions = {
    httpOnly: true,
    secure: config.production,
    sameSite: "lax",
    path: "/",
  };
  const clearCookie = (res) => res.clearCookie(cookieName, cookieOptions);
  const getToken = (req) => {
    const pairs = (req.headers.cookie || "").split(";");
    const found = pairs.filter((p) => p.trim().startsWith(cookieName + "="));
    if (found.length !== 1) return null;
    const value = found[0].trim().slice(cookieName.length + 1);
    return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
  };
  const findSession = (req) => {
    const value = getToken(req);
    if (!value) return null;
    const result = db
      .prepare(
        `SELECT sessions.token_hash,sessions.expires_at,users.id AS user_id,users.status AS user_status,companies.name,companies.slug,companies.prototype,companies.status AS company_status FROM sessions JOIN users ON users.id=sessions.user_id JOIN companies ON companies.id=users.company_id WHERE sessions.token_hash=?`,
      )
      .get(digest(value));
    if (!result) return null;
    if (
      result.expires_at <= clock() ||
      result.user_status !== "active" ||
      result.company_status !== "active" ||
      !validSlug(result.slug) ||
      result.slug !== result.prototype ||
      !prototypes.includes(result.prototype)
    ) {
      db.prepare("DELETE FROM sessions WHERE token_hash=?").run(
        result.token_hash,
      );
      return null;
    }
    return result;
  };
  const safePrototype = async (company) => {
    if (
      !prototypes.includes(company.prototype) ||
      !validSlug(company.slug) ||
      company.slug !== company.prototype
    )
      return null;
    try {
      const root = await realpath(config.prototypeRoot);
      const dir = await realpath(path.join(root, company.prototype));
      if (!within(root, dir)) return null;
      const index = await realpath(path.join(dir, "index.html"));
      if (!within(dir, index) || (await stat(index)).isFile() === false)
        return null;
      return dir;
    } catch {
      return null;
    }
  };
  const csrf = (req, res, next) => {
    if (
      req.get("origin") !== config.origin ||
      req.get("sec-fetch-site") === "cross-site"
    )
      return res.status(403).json({ message: "Solicitação não autorizada." });
    next();
  };
  let cleanupAt = 0;
  let activeVerifications = 0;
  const dummyHash = await hashPassword(token());
  app.post("/projetos/api/login", csrf, async (req, res) => {
    const now = clock();
    if (now >= cleanupAt) {
      db.prepare("DELETE FROM sessions WHERE expires_at<=?").run(now);
      db.prepare("DELETE FROM login_limits WHERE expires_at<=?").run(now);
      cleanupAt = now + 60000;
    }
    const ipLimit = consumeLimit(
      db,
      "ip:" + digest(req.ip || "unknown"),
      now,
      config.loginWindow,
      config.loginIpMax,
    );
    if (!ipLimit.allowed) {
      res.set("Retry-After", String(ipLimit.retry));
      return res.status(429).json({message: "Muitas tentativas. Aguarde alguns minutos e tente novamente."});
    }
    const username = normalizeUsername(req.body?.username);
    const userLimit = consumeLimit(
      db,
      "user:" + digest(username.slice(0, 64)),
      now,
      config.loginWindow,
      config.loginUserMax,
    );
    if (!userLimit.allowed) {
      res.set("Retry-After", String(Math.max(ipLimit.retry, userLimit.retry)));
      return res
        .status(429)
        .json({
          message:
            "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        });
    }
    const password = req.body?.password;
    if (
      !validUsername(username) ||
      typeof password !== "string" ||
      password.length > 1024 ||
      !password.length
    )
      return res.status(401).json({ message: genericLogin });
    const user = db
      .prepare(
        `SELECT users.id,users.password_hash,users.status,companies.slug,companies.prototype,companies.status AS company_status FROM users JOIN companies ON companies.id=users.company_id WHERE users.username=?`,
      )
      .get(username);
    const active =
      user && user.status === "active" && user.company_status === "active";
    if (activeVerifications >= config.verificationConcurrency) {
      res.set("Retry-After", "2");
      return res
        .status(429)
        .json({
          message:
            "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
        });
    }
    activeVerifications++;
    let valid;
    try {
      valid = await verifyPassword(
        active ? user.password_hash : dummyHash,
        password,
      );
    } finally {
      activeVerifications--;
    }
    if (!active || !valid)
      return res.status(401).json({ message: genericLogin });
    const available = await safePrototype(user);
    const current = db
      .prepare(
        `SELECT users.password_hash,users.status,companies.status AS company_status,companies.slug,companies.prototype FROM users JOIN companies ON companies.id=users.company_id WHERE users.id=?`,
      )
      .get(user.id);
    if (
      !current ||
      current.status !== "active" ||
      current.company_status !== "active" ||
      current.password_hash !== user.password_hash ||
      current.slug !== user.slug ||
      current.prototype !== user.prototype
    )
      return res.status(401).json({ message: genericLogin });
    if (!available)
      return res
        .status(503)
        .json({
          message:
            "Seu projeto está temporariamente indisponível. Entre em contato com a agência.",
        });
    const previous = getToken(req);
    if (previous)
      db.prepare("DELETE FROM sessions WHERE token_hash=?").run(
        digest(previous),
      );
    const sessionToken = token();
    db.prepare(
      "INSERT INTO sessions(token_hash,user_id,created_at,expires_at) VALUES(?,?,?,?)",
    ).run(digest(sessionToken), user.id, now, now + config.sessionTtl);
    res.cookie(cookieName, sessionToken, {
      ...cookieOptions,
      maxAge: config.sessionTtl,
    });
    return res.json({ redirect: `/projetos/${user.slug}/` });
  });
  app.post("/projetos/api/logout", csrf, (req, res) => {
    const value = getToken(req);
    if (value)
      db.prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(value));
    clearCookie(res);
    res.status(204).end();
  });
  app.get("/projetos/api/session", (req, res) => {
    const session = findSession(req);
    if (!session) {
      clearCookie(res);
      return res.status(401).json({ message: "Sessão indisponível." });
    }
    res.json({ redirect: `/projetos/${session.slug}/` });
  });
  app.all("/projetos/api/{*path}", (_req, res) =>
    res.status(404).json({ message: "Recurso não encontrado." }),
  );
  app.use(
    "/projetos/portal",
    express.static(config.publicRoot, {
      dotfiles: "deny",
      index: false,
      fallthrough: true,
      cacheControl: false,
      etag: false,
      lastModified: false,
    }),
  );
  app.get(["/projetos", "/projetos/"], async (req, res) => {
    const session = findSession(req);
    if (session) return res.redirect(303, `/projetos/${session.slug}/`);
    clearCookie(res);
    res
      .type("html")
      .send(await readFile(path.join(config.publicRoot, "index.html"), "utf8"));
  });
  app.use("/projetos/:slug", async (req, res) => {
    if (!["GET", "HEAD"].includes(req.method)) return res.status(405).end();
    const session = findSession(req);
    if (!session) {
      clearCookie(res);
      if (
        req.get("sec-fetch-dest") === "document" ||
        req.get("accept")?.includes("text/html")
      ) {
        return res.redirect(
          303,
          getToken(req) ? "/projetos?expired=1" : "/projetos",
        );
      }
      return res.status(401).end();
    }
    if (!validSlug(req.params.slug) || req.params.slug !== session.slug)
      return res
        .status(403)
        .type("html")
        .send(
          statusPage(
            "Acesso não autorizado",
            "Sua sessão não permite acessar este conteúdo.",
          ),
        );
    const dir = await safePrototype(session);
    if (!dir)
      return res
        .status(503)
        .type("html")
        .send(
          statusPage(
            "Projeto indisponível",
            "Esta apresentação está temporariamente indisponível. Entre em contato com a agência.",
          ),
        );
    if (req.originalUrl.split("?")[0] === `/projetos/${session.slug}`)
      return res.redirect(308, `/projetos/${session.slug}/`);
    let relative;
    try {
      relative = decodeURIComponent(req.path).replace(/^\/+/, "");
    } catch {
      return res.status(400).end();
    }
    const candidate = path.resolve(dir, relative || "index.html");
    if (!within(dir, candidate)) return res.status(404).end();
    let target;
    try {
      target = await realpath(candidate);
      if (!within(dir, target) || !(await stat(target)).isFile())
        return res.status(404).end();
    } catch {
      return res.status(404).end();
    }
    if (path.extname(target) === ".html") {
      const html = await readFile(target, "utf8");
      const controls =
        '<link rel="stylesheet" href="/projetos/portal/session.css"><script src="/projetos/portal/session.js" defer></script>';
      return res
        .type("html")
        .send(html.replace("</head>", controls + "</head>"));
    }
    res.sendFile(target, {
      cacheControl: false,
      etag: false,
      lastModified: false,
      acceptRanges: false,
      dotfiles: "deny",
    });
  });
  app.get("/", (_req, res) => res.redirect(303, "/projetos"));
  app.use((_req, res) =>
    res
      .status(404)
      .type("html")
      .send(
        statusPage(
          "Página não encontrada",
          "Este endereço não está disponível.",
        ),
      ),
  );
  app.use((error, _req, res, _next) => {
    if (error.type === "entity.too.large")
      return res.status(413).json({ message: "Solicitação muito grande." });
    if (error instanceof SyntaxError || error instanceof URIError)
      return res.status(400).json({ message: "Solicitação inválida." });
    console.error("WebForge: falha interna de requisição.");
    res
      .status(500)
      .json({ message: "Não foi possível concluir. Tente novamente." });
  });
  return app;
}
