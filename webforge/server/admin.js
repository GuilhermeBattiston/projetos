import { parseArgs } from "node:util";
import { emitKeypressEvents } from "node:readline";
import { readFile, stat } from "node:fs/promises";
import { loadConfig } from "./config.js";
import { openDatabase } from "./database.js";
import {
  createCompany,
  createUser,
  resetPassword,
  revokeSessions,
  setUserStatus,
  setCompanyStatus,
} from "./accounts.js";
process.umask(0o077);
async function hiddenInput(prompt) {
  if (!process.stdin.isTTY)
    throw new Error(
      "Use um terminal interativo ou WEBFORGE_PASSWORD_FILE apontando para um arquivo seguro.",
    );
  process.stdout.write(prompt);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = "";
    const done = () => {
      process.stdin.off("keypress", handler);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    };
    const handler = (character, key) => {
      if (key?.ctrl && key.name === "c") {
        done();
        reject(new Error("Operação cancelada."));
      } else if (key?.name === "return") {
        done();
        resolve(value);
      } else if (key?.name === "backspace") {
        value = Array.from(value).slice(0, -1).join("");
      } else if (
        character &&
        !key?.ctrl &&
        !key?.meta &&
        character.charCodeAt(0) >= 32
      ) {
        value += character;
      }
    };
    process.stdin.on("keypress", handler);
  });
}
async function readPassword() {
  if (process.env.WEBFORGE_PASSWORD_FILE) {
    const filename = process.env.WEBFORGE_PASSWORD_FILE;
    const info = await stat(filename);
    if (!info.isFile() || (info.mode & 0o077) !== 0)
      throw new Error("Arquivo de senha precisa ter permissões 0600.");
    return (await readFile(filename, "utf8")).replace(/\r?\n$/, "");
  }
  const first = await hiddenInput(
    "Senha (mínimo 14 caracteres; entrada oculta): ",
  );
  const second = await hiddenInput("Confirme a senha: ");
  if (first !== second) throw new Error("As senhas não correspondem.");
  return first;
}
const help = `WebForge — administração local (nenhuma conta padrão)\n\ncompany:create --name "Nome da empresa" --slug <slug> --prototype <slug>\nuser:create --company <slug> --username <usuario>\npassword:reset --username <usuario>\nuser:disable --username <usuario>\nuser:enable --username <usuario>\nsessions:revoke --username <usuario>\ncompany:disable --slug <slug>\ncompany:enable --slug <slug>\nlist\n\nSenhas são solicitadas com entrada oculta; nunca passe senhas em argumentos.\n`;
let db;
try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      name: { type: "string" },
      slug: { type: "string" },
      prototype: { type: "string" },
      company: { type: "string" },
      username: { type: "string" },
      help: { type: "boolean" },
    },
  });
  const command = positionals[0];
  if (values.help || !command) {
    console.log(help);
  } else {
    const config = loadConfig();
    db = openDatabase(config.dbPath);
    switch (command) {
      case "company:create":
        createCompany(db, {
          name: values.name,
          slug: values.slug,
          prototype: values.prototype,
        });
        break;
      case "user:create":
        await createUser(db, {
          companySlug: values.company,
          username: values.username,
          password: await readPassword(),
        });
        break;
      case "password:reset":
        await resetPassword(db, values.username, await readPassword());
        break;
      case "user:disable":
        setUserStatus(db, values.username, "disabled");
        break;
      case "user:enable":
        setUserStatus(db, values.username, "active");
        break;
      case "sessions:revoke":
        revokeSessions(db, values.username);
        break;
      case "company:disable":
        setCompanyStatus(db, values.slug, "disabled");
        break;
      case "company:enable":
        setCompanyStatus(db, values.slug, "active");
        break;
      case "list":
        console.table(
          db.prepare("SELECT name,slug,status FROM companies").all(),
        );
        console.table(
          db
            .prepare(
              "SELECT users.username,companies.slug AS company,users.status FROM users JOIN companies ON companies.id=users.company_id",
            )
            .all(),
        );
        break;
      default:
        throw new Error("Comando desconhecido. Use --help.");
    }
    if (command !== "list")
      console.log("Operação concluída. Nenhuma senha é registrada na saída.");
  }
} catch (error) {
  console.error(
    error.message.startsWith("UNIQUE constraint")
      ? "Registro já existente."
      : error.message,
  );
  process.exitCode = 1;
} finally {
  db?.close();
}
